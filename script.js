// ============================================
// FinanzApp - VERSIÓN EMPRENDEDOR COMPLETA
// 11 niveles, simulador, gráficos, confeti, calculadora
// ============================================

let currentScreen = 'menu';
let currentLevel = 1;
let levelsUnlocked = 1;
let levelsCompleted = JSON.parse(localStorage.getItem('finanzapp_completed')) || [];
let soundEnabled = localStorage.getItem('finanzapp_sound') !== 'false';
let vibrationEnabled = localStorage.getItem('finanzapp_vibration') !== 'false';

// NIVELES COMPLETOS (11)
const levels = [
    { 
        id: 1, 
        title: 'Costo de producción', 
        desc: 'Vas a hacer arepas de queso para vender. Compras: 1 kg de harina ($2.000), 1/2 kg de queso ($3.500) y pagas $500 de gas. ¿Cuál es el costo total de producción?', 
        type: 'input', 
        correct: 6000, 
        hint: 'Suma todo: 2000 + 3500 + 500',
        explanation: 'El costo de producción es todo lo que gastas para hacer el producto.'
    },
    { 
        id: 2, 
        title: 'Precio de venta', 
        desc: 'Con esa misma receta hiciste 10 arepas. El costo total fue $6.000. Quieres ganar el 40% sobre el costo. ¿A qué precio debes vender cada arepa? (Respuesta en pesos, sin decimales)', 
        type: 'input', 
        correct: 840, 
        hint: 'Primero calcula: 6000 × 0.40 = 2400 de ganancia total. Luego suma: 6000 + 2400 = 8400 total venta. Divide entre 10 arepas = 840 por arepa.',
        explanation: 'Precio = (costo total + ganancia deseada) / unidades'
    },
    { 
        id: 3, 
        title: 'Ganancia por unidad', 
        desc: 'Vendes cada arepa a $1.000. Sabemos que el costo de producir cada arepa es $600 (porque 6000/10). ¿Cuánto ganas por cada arepa vendida?', 
        type: 'input', 
        correct: 400, 
        hint: 'Precio venta - costo por unidad = 1000 - 600',
        explanation: 'La ganancia unitaria es lo que realmente te queda por cada venta.'
    },
    { 
        id: 4, 
        title: 'Gastos fijos y variables', 
        desc: 'De estos gastos, ¿cuál es FIJO (pagas sí o sí cada mes)?', 
        type: 'multiple', 
        options: [
            'Compra de harina (depende de las ventas)', 
            'Alquiler del local', 
            'Comisión al vendedor', 
            'Bolsas para empacar'
        ], 
        correct: 1, // índice 1 (alquiler)
        hint: 'El fijo no cambia aunque vendas poco.',
        explanation: 'Los gastos fijos como alquiler, servicios, sueldos base, se pagan incluso sin ventas.'
    },
    { 
        id: 5, 
        title: 'Punto de equilibrio', 
        desc: 'Tienes un negocio de arepas. Costos fijos mensuales: alquiler $50.000, servicios $20.000. Cada arepa la vendes a $1.000 y su costo variable (ingredientes) es $400. ¿Cuántas arepas debes vender al mes para no perder ni ganar? (Punto de equilibrio en unidades)', 
        type: 'input', 
        correct: 117, 
        hint: 'Fijos totales = 70.000. Ganancia por arepa = 1000-400=600. Unidades = 70000/600 = 116.66 → redondea a 117',
        explanation: 'Punto equilibrio = costos fijos / (precio - costo variable)'
    },
    { 
        id: 6, 
        title: 'Flujo de caja simple', 
        desc: 'En un día vendiste 30 arepas a $1.000 cada una. Gastaste $12.000 en ingredientes y pagaste $5.000 de transporte. ¿Cuánto dinero te queda en caja al final del día?', 
        type: 'input', 
        correct: 13000, 
        hint: 'Ingresos: 30×1000 = 30000. Gastos: 12000+5000=17000. Resta: 30000-17000',
        explanation: 'Flujo de caja = ingresos del día - gastos del día'
    },
    { 
        id: 7, 
        title: 'Separar finanzas', 
        desc: 'Tu negocio tiene $50.000 en caja. Necesitas comprar comida para tu casa por $15.000. ¿Qué debes hacer como buen emprendedor?', 
        type: 'multiple', 
        options: [
            'Tomar los $15.000 de la caja del negocio, total es mi dinero',
            'Pagar con tu dinero personal, NO mezclar',
            'Prestarle al negocio y luego devolver',
            'Esperar a vender más'
        ], 
        correct: 1, // índice 1
        hint: 'Nunca mezcles dinero personal con el del negocio.',
        explanation: 'Siempre separa: el dinero del negocio es para el negocio. Tú te pagas un sueldo o retiras ganancias.'
    },
    { 
        id: 8, 
        title: 'Presupuesto mensual', 
        desc: 'Proyectas vender 500 arepas al mes a $1.000 c/u. Tus costos variables son $400 por arepa y los fijos $70.000. ¿Cuál será tu ganancia neta del mes?', 
        type: 'input', 
        correct: 230000, 
        hint: 'Ingresos: 500×1000=500.000. Costos variables: 500×400=200.000. Fijos: 70.000. Ganancia = 500.000 - 200.000 - 70.000',
        explanation: 'Ganancia neta = ingresos - costos variables - costos fijos'
    },
    { 
        id: 9, 
        title: 'Impuestos básicos', 
        desc: 'Vendiste arepas por $500.000 en el mes. El impuesto a las ventas (IVA) es del 19%. ¿Cuánto debes pagar de IVA? (Responde en pesos, sin decimales)', 
        type: 'input', 
        correct: 95000, 
        hint: '500.000 × 0.19 = 95.000',
        explanation: 'El IVA se calcula como un porcentaje de tus ventas. Debes separarlo para pagarlo.'
    },
    { 
        id: 10, 
        title: 'Registro de ventas diarias', 
        desc: 'Llevas un registro de ventas: Lunes $80.000, Martes $95.000, Miércoles $110.000. ¿Cuál es el promedio de ventas por día?', 
        type: 'input', 
        correct: 95000, 
        hint: 'Suma: 80000+95000+110000=285000. Divide entre 3: 95000',
        explanation: 'Llevar un registro te ayuda a proyectar y tomar decisiones.'
    },
    { 
        id: 11, 
        title: 'Préstamo e intereses', 
        desc: 'Pides un préstamo de $1.000.000 al banco con un interés mensual del 2%. Si lo pagas en un mes, ¿cuánto pagarás en total?', 
        type: 'input', 
        correct: 1020000, 
        hint: 'Interés = 1.000.000 × 0.02 = 20.000. Total = 1.000.000 + 20.000',
        explanation: 'Los intereses son el costo del dinero prestado.'
    }
];

// Consejos financieros
const tips = [
    "Siempre separa el dinero del negocio de tu dinero personal.",
    "Págate un sueldo fijo, no saques dinero del negocio a cada rato.",
    "Registra todos los gastos, por pequeños que sean.",
    "Antes de poner precio, calcula todos tus costos.",
    "Ten un fondo de emergencia para el negocio.",
    "No confundas ganancia con liquidez.",
    "Reinvierte una parte de tus ganancias para crecer.",
    "El IVA no es tuyo, es del Estado. Sepáralo.",
    "Un préstamo puede ayudarte a crecer, pero cuidado con los intereses."
];
let currentTipIndex = 0;

// Elementos del DOM
const screens = {
    menu: document.getElementById('menu-screen'),
    map: document.getElementById('map-screen'),
    game: document.getElementById('game-screen'),
    tips: document.getElementById('tips-screen'),
    settings: document.getElementById('settings-screen'),
    simulator: document.getElementById('simulator-screen')
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
    
    if (screenId === 'map') {
        renderMap();
        updateGlobalProgress();
    }
    if (screenId === 'tips') showTip();
    if (screenId === 'settings') loadSettingsUI();
    if (screenId === 'simulator') initSimulator();
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
    document.getElementById('question-box').innerHTML = `<i class="fas fa-lightbulb" style="color:#ffb347;"></i> ${level.explanation || 'Resuelve el problema'}`;
    
    const answerArea = document.getElementById('answer-area');
    answerArea.innerHTML = '';
    
    if (level.type === 'input') {
        answerArea.innerHTML = `<input type="number" id="answer-input" placeholder="Escribe tu respuesta..." step="any">`;
    } else if (level.type === 'multiple') {
        let html = '<div class="answer-options">';
        level.options.forEach((opt, idx) => {
            html += `<button class="option-btn" data-opt-index="${idx}">${opt}</button>`;
        });
        html += '</div>';
        answerArea.innerHTML = html;
        
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }
    
    document.getElementById('feedback').innerHTML = '';
    showScreen('game');
}

// --- Obtener respuesta del usuario ---
function getUserAnswer(level) {
    if (level.type === 'input') {
        const val = document.getElementById('answer-input')?.value;
        return val ? parseFloat(val) : NaN;
    } else if (level.type === 'multiple') {
        const selected = document.querySelector('.option-btn.selected');
        return selected ? parseInt(selected.dataset.optIndex) : null;
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
        document.getElementById('feedback').innerHTML = '✅ ¡Correcto! ' + (level.explanation || 'Bien hecho.');
        playSound('success');
        vibrate([100, 50, 100]);
        
        if (!levelsCompleted.includes(level.id)) {
            levelsCompleted.push(level.id);
            localStorage.setItem('finanzapp_completed', JSON.stringify(levelsCompleted));
            if (level.id === levelsUnlocked && level.id < levels.length) {
                levelsUnlocked = level.id + 1;
            }
        }
        
        startConfetti();
        
        showModal('¡Nivel completado!', () => {
            stopConfetti();
            showScreen('map');
        });
    } else {
        document.getElementById('feedback').innerHTML = `❌ Incorrecto. ${level.hint || 'Intenta de nuevo'}`;
        playSound('error');
        vibrate(300);
    }
}

// --- Confeti ---
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

// --- Modal ---
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
        if (prevValue !== null && operator) compute();
        prevValue = parseFloat(calcValue);
        operator = val;
        newNumber = true;
    } else if (val === '=') {
        compute();
        operator = null;
        newNumber = true;
    } else {
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

// --- SIMULADOR DE NEGOCIO ---
let simulatorChart;

function initSimulator() {
    document.getElementById('sim-price').value = 1000;
    document.getElementById('sim-var-cost').value = 400;
    document.getElementById('sim-fixed-cost').value = 70000;
    document.getElementById('sim-units').value = 500;
    
    calculateSimulator();
    
    document.getElementById('sim-calculate').addEventListener('click', calculateSimulator);
}

function calculateSimulator() {
    const price = parseFloat(document.getElementById('sim-price').value) || 0;
    const varCost = parseFloat(document.getElementById('sim-var-cost').value) || 0;
    const fixedCost = parseFloat(document.getElementById('sim-fixed-cost').value) || 0;
    const units = parseFloat(document.getElementById('sim-units').value) || 0;
    
    const revenue = price * units;
    const totalVar = varCost * units;
    const profit = revenue - totalVar - fixedCost;
    const breakeven = fixedCost / (price - varCost);
    
    document.getElementById('sim-revenue').innerText = '$' + revenue.toLocaleString();
    document.getElementById('sim-var-total').innerText = '$' + totalVar.toLocaleString();
    document.getElementById('sim-fixed-total').innerText = '$' + fixedCost.toLocaleString();
    document.getElementById('sim-profit').innerText = '$' + profit.toLocaleString();
    document.getElementById('sim-breakeven').innerText = Math.ceil(breakeven) || 0;
    
    updateSimChart(revenue, totalVar, fixedCost, profit);
}

function updateSimChart(revenue, totalVar, fixedCost, profit) {
    const ctx = document.getElementById('simChart').getContext('2d');
    
    if (simulatorChart) {
        simulatorChart.destroy();
    }
    
    simulatorChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ingresos', 'Costos variables', 'Costos fijos', 'Ganancia neta'],
            datasets: [{
                label: 'Monto ($)',
                data: [revenue, totalVar, fixedCost, profit],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#2196f3'],
                borderColor: 'white',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { color: 'white' } },
                x: { ticks: { color: 'white' } }
            },
            plugins: { legend: { labels: { color: 'white' } } }
        }
    });
}

// --- Event listeners ---
document.addEventListener('DOMContentLoaded', () => {
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
    document.getElementById('btn-simulator').addEventListener('click', () => {
        playSound('click');
        showScreen('simulator');
    });
    
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
    document.getElementById('back-from-simulator').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
    });
    
    document.getElementById('submit-answer').addEventListener('click', checkAnswer);
    document.getElementById('next-tip').addEventListener('click', nextTip);
    
    document.getElementById('sound-toggle').addEventListener('change', (e) => {
        soundEnabled = e.target.checked;
        saveSettings();
    });
    document.getElementById('vibration-toggle').addEventListener('change', (e) => {
        vibrationEnabled = e.target.checked;
        saveSettings();
    });
    document.getElementById('reset-progress').addEventListener('click', resetProgress);
    
    function openCalc() {
        document.getElementById('calc-modal').classList.add('show');
    }
    document.getElementById('open-calc').addEventListener('click', openCalc);
    document.getElementById('open-calc-game').addEventListener('click', openCalc);
    document.getElementById('close-calc').addEventListener('click', () => {
        document.getElementById('calc-modal').classList.remove('show');
    });
    
    document.querySelectorAll('.calc-btn-key').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const val = btn.dataset.value;
            if (val) handleCalcButton(val);
            else if (btn.id === 'calc-clear') handleCalcButton('C');
            else if (btn.id === 'calc-backspace') handleCalcButton('←');
            else if (btn.id === 'calc-equals') handleCalcButton('=');
        });
    });
    
    showScreen('menu');
    renderMap();
    showTip();
    updateCalcDisplay();
});