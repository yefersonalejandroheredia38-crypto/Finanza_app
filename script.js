// ============================================
// FinanzApp - Versión Mejorada
// Incluye: niveles básicos, múltiple, drag, calculadora, progreso, confeti, animaciones
// ============================================

// --- Variables globales ---
let currentScreen = 'menu';
let currentLevel = 1;
let levelsUnlocked = 1;
let levelsCompleted = JSON.parse(localStorage.getItem('finanzapp_completed')) || [];
let soundEnabled = localStorage.getItem('finanzapp_sound') !== 'false';
let vibrationEnabled = localStorage.getItem('finanzapp_vibration') !== 'false';

// Variables para drag & drop (simulado)
let dragSelectedItem = null;
let dragItems = [];

// Datos de niveles (desde lo más básico)
const levels = [
    // NIVELES BÁSICOS (aprender a sumar/restar)
    { id: 1, title: 'Suma simple', desc: 'Si vendes 5 limonadas a $10 cada una, ¿cuánto dinero ingresas?', 
      type: 'input', correct: 50, hint: 'Multiplica 5 × 10' },
    { id: 2, title: 'Resta simple', desc: 'Compraste limones por $20 y azúcar por $15. ¿Cuánto gastaste en total?', 
      type: 'input', correct: 35, hint: 'Suma 20 + 15' },
    { id: 3, title: 'Concepto de ganancia', desc: 'Ingresos: $100, Gastos: $70. ¿Cuál es la ganancia?', 
      type: 'input', correct: 30, hint: 'Ingresos - Gastos' },
    // NIVEL CON OPCIONES MÚLTIPLES
    { id: 4, title: '¿Qué es un gasto fijo?', desc: 'Selecciona cuál de estos es un gasto fijo en un negocio.', 
      type: 'multiple', options: ['Compra de mercancía', 'Pago de alquiler', 'Comisión por venta', 'Publicidad variable'], 
      correct: 1, hint: 'Es el que pagas cada mes, sin importar las ventas.' }, // índice 1 (alquiler)
    // NIVEL CON ARRASTRAR (simulado con botones)
    { id: 5, title: 'Ordena los pasos', desc: 'Arrastra los pasos en orden correcto para calcular la ganancia:', 
      type: 'drag', items: ['Calcular ingresos', 'Calcular gastos', 'Restar gastos de ingresos'], 
      correctOrder: [0,1,2], hint: 'Primero ingresos, luego gastos, después resta.' },
    // NIVEL AVANZADO (punto de equilibrio)
    { id: 6, title: 'Punto de equilibrio', desc: 'Costos fijos: $500, precio venta: $20, costo variable: $5. ¿Cuántas unidades necesitas vender para no perder?', 
      type: 'input', correct: 34, hint: '500 / (20-5) = 33.33, redondea a 34' },
    // Puedes agregar más
];

// Consejos financieros
const tips = [
    "Separa siempre tus gastos personales de los del negocio.",
    "Ahorra al menos el 10% de tus ganancias para imprevistos.",
    "Reinvierte una parte de tus utilidades para crecer.",
    "Lleva un registro diario de ingresos y gastos.",
    "Calcula tu punto de equilibrio antes de lanzar un producto.",
    "No mezcles las deudas del negocio con las personales.",
    "Controla tu flujo de caja semanalmente.",
    "El ahorro es la base de la inversión."
];
let currentTipIndex = 0;

// Elementos del DOM
const screens = {
    menu: document.getElementById('menu-screen'),
    map: document.getElementById('map-screen'),
    game: document.getElementById('game-screen'),
    tips: document.getElementById('tips-screen'),
    settings: document.getElementById('settings-screen')
};

// --- Funciones de sonido y vibración ---
function playSound(type) {
    if (!soundEnabled) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if (type === 'success') {
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.3;
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.2);
        } else if (type === 'error') {
            oscillator.frequency.value = 300;
            gainNode.gain.value = 0.3;
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.15);
        } else if (type === 'click') {
            oscillator.frequency.value = 600;
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.05);
        } else if (type === 'unlock') {
            oscillator.frequency.value = 1000;
            gainNode.gain.value = 0.3;
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.3);
        }
    } catch (e) {}
}

function vibrate(pattern) {
    if (!vibrationEnabled) return;
    if (navigator.vibrate) navigator.vibrate(pattern);
}

// --- Animación entre pantallas ---
function showScreen(screenId) {
    const currentActive = document.querySelector('.screen.active');
    const nextScreen = screens[screenId];
    if (!nextScreen) return;
    
    if (currentActive && currentActive !== nextScreen) {
        currentActive.classList.remove('active');
        currentActive.classList.add('exit-left');
        setTimeout(() => {
            currentActive.classList.remove('exit-left');
        }, 400);
    }
    
    nextScreen.classList.add('active', 'enter-right');
    setTimeout(() => {
        nextScreen.classList.remove('enter-right');
    }, 50);
    
    currentScreen = screenId;
    
    // Actualizar contenido según pantalla
    if (screenId === 'map') {
        renderMap();
        updateGlobalProgress();
    }
    if (screenId === 'tips') showTip();
    if (screenId === 'settings') loadSettingsUI();
}

// --- Barra de progreso global ---
function updateGlobalProgress() {
    const percent = Math.round((levelsCompleted.length / levels.length) * 100);
    document.getElementById('progress-percent').innerText = percent + '%';
    document.getElementById('global-progress-bar').style.width = percent + '%';
}

// --- Renderizar mapa de niveles ---
function renderMap() {
    const container = document.getElementById('level-map-container');
    container.innerHTML = '';
    levels.forEach(level => {
        const completed = levelsCompleted.includes(level.id);
        const locked = level.id > levelsUnlocked;
        
        const node = document.createElement('div');
        node.className = `level-node ${locked ? 'locked' : ''} ${completed ? 'completed' : ''}`;
        node.dataset.level = level.id;
        
        node.innerHTML = `
            <div class="node-icon">${level.id}</div>
            <div class="node-info">
                <h3>${level.title}</h3>
                <p>${completed ? 'Completado' : (locked ? 'Bloqueado' : 'Disponible')}</p>
            </div>
            ${locked ? '<i class="fas fa-lock lock-icon"></i>' : ''}
        `;
        
        if (!locked) {
            node.addEventListener('click', () => {
                playSound('click');
                startLevel(level.id);
            });
        }
        container.appendChild(node);
    });
    updateGlobalProgress();
}

// --- Iniciar un nivel ---
function startLevel(levelId) {
    currentLevel = levelId;
    const level = levels.find(l => l.id === levelId);
    if (!level) return;
    
    document.getElementById('level-title').innerText = `Nivel ${level.id}: ${level.title}`;
    document.getElementById('level-description').innerText = level.desc;
    document.getElementById('question-box').innerText = '¿Cuál es la respuesta?';
    
    const answerArea = document.getElementById('answer-area');
    answerArea.innerHTML = ''; // limpiar
    
    if (level.type === 'input') {
        answerArea.innerHTML = `<input type="number" id="answer-input" placeholder="Escribe tu respuesta..." step="any">`;
    } else if (level.type === 'multiple') {
        let html = '<div class="answer-options">';
        level.options.forEach((opt, idx) => {
            html += `<button class="option-btn" data-opt-index="${idx}">${opt}</button>`;
        });
        html += '</div>';
        answerArea.innerHTML = html;
        
        // Añadir evento a opciones
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    } else if (level.type === 'drag') {
        // Simulación de drag con botones (para móvil es más práctico)
        dragItems = level.items.map((item, idx) => ({ text: item, id: idx, selected: false }));
        renderDragArea(level);
    }
    
    document.getElementById('feedback').innerHTML = '';
    showScreen('game');
}

// --- Renderizar área de drag (simulado) ---
function renderDragArea(level) {
    const answerArea = document.getElementById('answer-area');
    let html = `
        <div class="drag-zone" id="drag-source">
            ${dragItems.map((item, i) => `<div class="drag-item" data-drag-id="${item.id}">${item.text}</div>`).join('')}
        </div>
        <div class="drop-zone" id="drop-zone"></div>
        <p style="text-align:center; margin:5px 0;">(Toca un elemento y luego toca la zona para colocarlo)</p>
    `;
    answerArea.innerHTML = html;
    
    // Lógica de selección (simulando drag)
    document.querySelectorAll('.drag-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Si ya está seleccionado, lo deseleccionamos
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                dragSelectedItem = null;
            } else {
                document.querySelectorAll('.drag-item').forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                dragSelectedItem = {
                    id: parseInt(this.dataset.dragId),
                    text: this.innerText
                };
            }
        });
    });
    
    // Zona de drop
    const dropZone = document.getElementById('drop-zone');
    dropZone.addEventListener('click', function() {
        if (dragSelectedItem) {
            // Añadir el elemento al drop zone
            const newItem = document.createElement('div');
            newItem.className = 'drag-item';
            newItem.innerText = dragSelectedItem.text;
            newItem.dataset.dragId = dragSelectedItem.id;
            // No se puede quitar fácil, pero para el juego lo marcamos como colocado
            // Eliminamos el original de la zona source
            const sourceItem = document.querySelector(`.drag-item[data-drag-id="${dragSelectedItem.id}"]:not(.placed)`);
            if (sourceItem) {
                sourceItem.remove();
                dropZone.appendChild(newItem);
                // Actualizar orden en dragItems (opcional)
                // Aquí simplemente lo marcamos como colocado
                newItem.classList.add('placed');
                dragSelectedItem = null;
                document.querySelectorAll('.drag-item').forEach(i => i.classList.remove('selected'));
            }
        }
    });
}

// --- Obtener respuesta del usuario según tipo ---
function getUserAnswer(level) {
    if (level.type === 'input') {
        const val = document.getElementById('answer-input')?.value;
        return val ? parseFloat(val) : NaN;
    } else if (level.type === 'multiple') {
        const selected = document.querySelector('.option-btn.selected');
        return selected ? parseInt(selected.dataset.optIndex) : null;
    } else if (level.type === 'drag') {
        // Leer el orden de los elementos en drop-zone
        const dropItems = document.querySelectorAll('#drop-zone .drag-item');
        const order = Array.from(dropItems).map(item => parseInt(item.dataset.dragId));
        return order;
    }
    return null;
}

// --- Comparar respuesta correcta ---
function isAnswerCorrect(userAns, level) {
    if (level.type === 'input') {
        if (isNaN(userAns)) return false;
        return Math.abs(userAns - level.correct) < 0.01;
    } else if (level.type === 'multiple') {
        return userAns === level.correct;
    } else if (level.type === 'drag') {
        if (!userAns || userAns.length !== level.correctOrder.length) return false;
        return userAns.every((val, idx) => val === level.correctOrder[idx]);
    }
    return false;
}

// --- Comprobar respuesta ---
function checkAnswer() {
    const level = levels.find(l => l.id === currentLevel);
    if (!level) return;
    
    const userAnswer = getUserAnswer(level);
    const correct = isAnswerCorrect(userAnswer, level);
    
    if (correct) {
        document.getElementById('feedback').innerHTML = '✅ ¡Correcto! Nivel superado.';
        playSound('success');
        vibrate([100, 50, 100]);
        
        // Marcar completado
        if (!levelsCompleted.includes(level.id)) {
            levelsCompleted.push(level.id);
            localStorage.setItem('finanzapp_completed', JSON.stringify(levelsCompleted));
            // Desbloquear siguiente
            if (level.id === levelsUnlocked && level.id < levels.length) {
                levelsUnlocked = level.id + 1;
            }
        }
        
        // Lanzar confeti
        startConfetti();
        
        // Mostrar modal
        showModal('¡Nivel completado!', () => {
            stopConfetti();
            showScreen('map');
        });
    } else {
        let hint = level.hint || 'Intenta de nuevo';
        document.getElementById('feedback').innerHTML = `❌ Incorrecto. ${hint}`;
        playSound('error');
        vibrate(300);
    }
}

// --- Confetti con canvas ---
let confettiCanvas, ctx, confettiAnimation;
function startConfetti() {
    confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) return;
    confettiCanvas.style.display = 'block';
    ctx = confettiCanvas.getContext('2d');
    
    const particles = [];
    const colors = ['#ffb347', '#4caf50', '#f44336', '#2196f3', '#ffeb3b'];
    
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            size: Math.random() * 8 + 2,
            speed: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
    
    function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        for (let p of particles) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            p.y += p.speed;
            if (p.y > confettiCanvas.height) {
                p.y = -10;
                p.x = Math.random() * confettiCanvas.width;
            }
        }
        
        confettiAnimation = requestAnimationFrame(draw);
    }
    
    draw();
}

function stopConfetti() {
    if (confettiAnimation) {
        cancelAnimationFrame(confettiAnimation);
    }
    if (confettiCanvas) {
        confettiCanvas.style.display = 'none';
    }
}

// --- Modal de mensaje ---
function showModal(message, callback) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-message').innerText = message;
    modal.classList.add('show');
    
    const closeBtn = document.getElementById('modal-close');
    closeBtn.onclick = () => {
        modal.classList.remove('show');
        if (callback) callback();
    };
}

// --- Consejos ---
function showTip() {
    document.getElementById('tip-text').innerText = tips[currentTipIndex];
}
function nextTip() {
    currentTipIndex = (currentTipIndex + 1) % tips.length;
    showTip();
    playSound('click');
}

// --- Calculadora ---
let calcValue = '0';
let prevValue = null;
let operator = null;
let newNumber = true;

function updateCalcDisplay() {
    document.getElementById('calc-display').innerText = calcValue;
}

function handleCalcButton(val) {
    if (val === 'C') {
        calcValue = '0';
        prevValue = null;
        operator = null;
        newNumber = true;
    } else if (val === '←') {
        if (calcValue.length > 1) calcValue = calcValue.slice(0, -1);
        else calcValue = '0';
        newNumber = false;
    } else if (val === '+' || val === '-' || val === '*' || val === '/') {
        if (prevValue !== null && operator) {
            // calcular parcial
            compute();
        }
        prevValue = parseFloat(calcValue);
        operator = val;
        newNumber = true;
    } else if (val === '=') {
        compute();
        operator = null;
        newNumber = true;
    } else {
        // números y punto
        if (newNumber) {
            calcValue = val === '.' ? '0.' : val;
            newNumber = false;
        } else {
            if (val === '.' && calcValue.includes('.')) return;
            calcValue += val;
        }
    }
    updateCalcDisplay();
}

function compute() {
    if (prevValue === null || operator === null) return;
    const current = parseFloat(calcValue);
    let result = 0;
    switch(operator) {
        case '+': result = prevValue + current; break;
        case '-': result = prevValue - current; break;
        case '*': result = prevValue * current; break;
        case '/': result = prevValue / current; break;
        default: return;
    }
    calcValue = result.toString();
    prevValue = null;
    operator = null;
}

// --- Ajustes ---
function loadSettingsUI() {
    document.getElementById('sound-toggle').checked = soundEnabled;
    document.getElementById('vibration-toggle').checked = vibrationEnabled;
}
function saveSettings() {
    localStorage.setItem('finanzapp_sound', soundEnabled);
    localStorage.setItem('finanzapp_vibration', vibrationEnabled);
}
function resetProgress() {
    if (confirm('¿Reiniciar todo el progreso? Se perderán los niveles completados.')) {
        levelsCompleted = [];
        levelsUnlocked = 1;
        localStorage.removeItem('finanzapp_completed');
        renderMap();
        playSound('click');
        vibrate(100);
    }
}

// --- Event listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Botones de menú
    document.getElementById('btn-play').addEventListener('click', () => {
        playSound('click');
        showScreen('map');
    });
    document.getElementById('btn-tips').addEventListener('click', () => {
        playSound('click');
        showScreen('tips');
    });
    document.getElementById('btn-settings').addEventListener('click', () => {
        playSound('click');
        showScreen('settings');
    });
    
    // Botones de retroceso
    document.getElementById('back-from-map').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
    });
    document.getElementById('back-from-game').addEventListener('click', () => {
        playSound('click');
        showScreen('map');
    });
    document.getElementById('back-from-tips').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
    });
    document.getElementById('back-from-settings').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
    });
    
    // Botón comprobar respuesta
    document.getElementById('submit-answer').addEventListener('click', checkAnswer);
    
    // Siguiente consejo
    document.getElementById('next-tip').addEventListener('click', nextTip);
    
    // Ajustes
    document.getElementById('sound-toggle').addEventListener('change', (e) => {
        soundEnabled = e.target.checked;
        saveSettings();
    });
    document.getElementById('vibration-toggle').addEventListener('change', (e) => {
        vibrationEnabled = e.target.checked;
        saveSettings();
    });
    document.getElementById('reset-progress').addEventListener('click', resetProgress);
    
    // Calculadora
    function openCalc() {
        document.getElementById('calc-modal').classList.add('show');
    }
    document.getElementById('open-calc').addEventListener('click', openCalc);
    document.getElementById('open-calc-game').addEventListener('click', openCalc);
    document.getElementById('close-calc').addEventListener('click', () => {
        document.getElementById('calc-modal').classList.remove('show');
    });
    
    // Botones de calculadora
    document.querySelectorAll('.calc-btn-key').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const val = btn.dataset.value;
            if (val) handleCalcButton(val);
            else if (btn.id === 'calc-clear') handleCalcButton('C');
            else if (btn.id === 'calc-backspace') handleCalcButton('←');
            else if (btn.id === 'calc-equals') handleCalcButton('=');
        });
    });
    
    // Inicializar
    showScreen('menu');
    renderMap();
    showTip();
    updateCalcDisplay();
});