// ============================================
// FinanzApp - Lógica completa del juego
// ============================================

// --- Variables globales ---
let currentScreen = 'menu';
let currentLevel = 1;
let levelsUnlocked = 1; // Niveles desbloqueados (por defecto 1)
let levelsCompleted = JSON.parse(localStorage.getItem('finanzapp_completed')) || []; // Array de IDs completados
let soundEnabled = localStorage.getItem('finanzapp_sound') !== 'false'; // por defecto true
let vibrationEnabled = localStorage.getItem('finanzapp_vibration') !== 'false';

// Niveles de datos
const levels = [
    { id: 1, title: 'Ganancias simples', desc: 'Tu puesto de limonada tuvo ingresos de $15,000 y gastos de $8,000. ¿Cuál es la utilidad?', 
      type: 'input', correct: 7000, hint: 'Ingresos - Gastos' },
    { id: 2, title: 'Porcentaje de ganancia', desc: 'Compraste un producto a $2,000 y lo vendes a $2,500. ¿Qué porcentaje de ganancia obtuviste? (responde solo el número, sin %)',
      type: 'input', correct: 25, hint: '(venta - costo) / costo * 100' },
    { id: 3, title: 'Punto de equilibrio', desc: 'Tus costos fijos son $10,000. Cada unidad la vendes a $500 y cuesta $300 producirla. ¿Cuántas unidades debes vender para no perder ni ganar?',
      type: 'input', correct: 50, hint: 'Costos fijos / (precio - costo variable)' },
    // Puedes agregar más niveles aquí
];

// Consejos financieros
const tips = [
    "Separa siempre tus gastos personales de los del negocio.",
    "Ahorra al menos el 10% de tus ganancias para imprevistos.",
    "Reinvierte una parte de tus utilidades para crecer.",
    "Lleva un registro diario de ingresos y gastos.",
    "Calcula tu punto de equilibrio antes de lanzar un producto.",
    "No mezcles las deudas del negocio con las personales.",
    "Ofrece descuentos por volumen para mover inventario.",
    "Controla tu flujo de caja semanalmente."
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
    } catch (e) {
        // fallback si el navegador no soporta Web Audio
    }
}

function vibrate(pattern) {
    if (!vibrationEnabled) return;
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

// --- Navegación entre pantallas ---
function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
    currentScreen = screenId;
    
    // Actualizar contenido según pantalla
    if (screenId === 'map') renderMap();
    if (screenId === 'tips') showTip();
    if (screenId === 'settings') loadSettingsUI();
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
}

// --- Iniciar un nivel ---
function startLevel(levelId) {
    currentLevel = levelId;
    const level = levels.find(l => l.id === levelId);
    if (!level) return;
    
    document.getElementById('level-title').innerText = level.title;
    document.getElementById('level-description').innerText = level.desc;
    
    const questionBox = document.getElementById('question-box');
    const answerArea = document.getElementById('answer-area');
    
    // Preparar área de respuesta según tipo (por ahora solo input)
    questionBox.innerText = '¿Cuál es la respuesta?';
    answerArea.innerHTML = `<input type="number" id="answer-input" placeholder="Escribe tu respuesta..." step="any">`;
    
    // Resetear feedback
    document.getElementById('feedback').innerHTML = '';
    
    showScreen('game');
}

// --- Comprobar respuesta ---
function checkAnswer() {
    const level = levels.find(l => l.id === currentLevel);
    if (!level) return;
    
    let userAnswer;
    const input = document.getElementById('answer-input');
    if (input) {
        userAnswer = parseFloat(input.value);
    } else {
        // para futuros tipos de pregunta
        return;
    }
    
    if (isNaN(userAnswer)) {
        document.getElementById('feedback').innerHTML = '❌ Ingresa un número válido';
        playSound('error');
        vibrate(200);
        return;
    }
    
    const tolerance = 0.01; // margen por decimales
    const isCorrect = Math.abs(userAnswer - level.correct) < tolerance;
    
    if (isCorrect) {
        // Éxito
        document.getElementById('feedback').innerHTML = '✅ ¡Correcto! Nivel superado.';
        playSound('success');
        vibrate([100, 50, 100]);
        
        // Marcar como completado si no lo estaba
        if (!levelsCompleted.includes(level.id)) {
            levelsCompleted.push(level.id);
            localStorage.setItem('finanzapp_completed', JSON.stringify(levelsCompleted));
        }
        
        // Desbloquear siguiente nivel
        if (level.id === levelsUnlocked && level.id < levels.length) {
            levelsUnlocked = level.id + 1;
        }
        
        // Mostrar modal
        showModal('¡Nivel completado!', () => {
            showScreen('map');
        });
    } else {
        document.getElementById('feedback').innerHTML = `❌ Incorrecto. Pista: ${level.hint}`;
        playSound('error');
        vibrate(300);
    }
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
    
    // Toggles de ajustes
    document.getElementById('sound-toggle').addEventListener('change', (e) => {
        soundEnabled = e.target.checked;
        saveSettings();
    });
    document.getElementById('vibration-toggle').addEventListener('change', (e) => {
        vibrationEnabled = e.target.checked;
        saveSettings();
    });
    document.getElementById('reset-progress').addEventListener('click', resetProgress);
    
    // Iniciar con menú
    showScreen('menu');
    renderMap();
    showTip();
});
