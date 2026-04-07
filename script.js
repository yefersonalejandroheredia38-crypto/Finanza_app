// ============================================
// FINANZAPP - VERSIÓN COMPLETA (VENEZUELA REAL)
// 20 niveles, cursos, inversor, respaldo local, precios en USD
// ============================================

// ============================================
// VARIABLES GLOBALES
// ============================================
let currentScreen = 'menu';
let currentLevel = 1;
let levelsUnlocked = 1;
let levelsCompleted = JSON.parse(localStorage.getItem('finanzapp_completed')) || [];
let soundEnabled = localStorage.getItem('finanzapp_sound') !== 'false';
let vibrationEnabled = localStorage.getItem('finanzapp_vibration') !== 'false';
let businessName = localStorage.getItem('finanzapp_business') || 'Mi negocio';
let darkTheme = localStorage.getItem('finanzapp_theme') !== 'light';
let reminderEnabled = localStorage.getItem('finanzapp_reminder') === 'true';
let diaryEntries = JSON.parse(localStorage.getItem('finanzapp_diary')) || [];
let achievements = JSON.parse(localStorage.getItem('finanzapp_achievements')) || [];

// Progreso de cursos (cada curso tiene lecciones completadas)
let courseProgress = JSON.parse(localStorage.getItem('finanzapp_courses')) || {
    'emprendimiento': [],
    'marketing': [],
    'finanzas': []
};

// ============================================
// SISTEMA DE LOGROS (igual que antes)
// ============================================
const achievementsList = [
    { id: 1, name: 'Primer paso', description: 'Completa el nivel 1', icon: 'fa-star', unlocked: false },
    { id: 2, name: 'Aprendiz de costos', description: 'Completa 5 niveles', icon: 'fa-graduation-cap', unlocked: false },
    { id: 3, name: 'Maestro financiero', description: 'Completa 10 niveles', icon: 'fa-crown', unlocked: false },
    { id: 4, name: 'Emprendedor real', description: 'Completa 15 niveles', icon: 'fa-rocket', unlocked: false },
    { id: 5, name: 'Experto total', description: 'Completa todos los niveles', icon: 'fa-trophy', unlocked: false },
    { id: 6, name: 'Diario activo', description: 'Registra 10 entradas en el diario', icon: 'fa-book', unlocked: false },
    { id: 7, name: 'Simulador pro', description: 'Usa el simulador 5 veces', icon: 'fa-chart-line', unlocked: false },
    { id: 8, name: 'Racha de 7 días', description: 'Abre la app 7 días seguidos', icon: 'fa-calendar-check', unlocked: false },
    { id: 9, name: 'Personalizador', description: 'Cambia el nombre del negocio', icon: 'fa-pen', unlocked: false },
    { id: 10, name: 'Inversor novato', description: 'Usa el simulador de inversiones', icon: 'fa-chart-pie', unlocked: false },
    { id: 11, name: 'Estudiante', description: 'Completa un curso', icon: 'fa-graduation-cap', unlocked: false }
];

// ============================================
// NIVELES 1-20 CON PRECIOS REALES VENEZUELA (USD)
// ============================================
const levels = [
    { id: 1, title: 'Costo de producción', desc: 'Vas a hacer arepas de queso. Compras: 1 kg de harina ($2), 1/2 kg de queso ($2.5) y pagas $0.5 de gas. ¿Costo total?', type: 'input', correct: 5, hint: '2 + 2.5 + 0.5 = 5', explanation: 'El costo de producción es la suma de todos los gastos.' },
    { id: 2, title: 'Precio de venta', desc: 'Hiciste 10 arepas. Costo total $5. Quieres ganar 40%. ¿Precio por arepa?', type: 'input', correct: 0.7, hint: 'Ganancia total = 5×0.4=2. Total venta=7. Divide 7/10=0.7', explanation: 'Precio = (costo + ganancia) / unidades' },
    { id: 3, title: 'Ganancia por unidad', desc: 'Vendes arepa a $1. Costo por arepa $0.5. ¿Ganancia unitaria?', type: 'input', correct: 0.5, hint: '1 - 0.5 = 0.5', explanation: 'Ganancia unitaria = precio - costo unitario' },
    { id: 4, title: 'Gastos fijos y variables', desc: '¿Cuál es GASTO FIJO?', type: 'multiple', options: ['Harina', 'Alquiler local $30', 'Comisión por venta', 'Bolsas'], correct: 1, hint: 'El alquiler no cambia.', explanation: 'Fijos: alquiler, servicios. Variables: materia prima.' },
    { id: 5, title: 'Punto de equilibrio', desc: 'Costos fijos: alquiler $30, servicios $10. Precio arepa $1, costo variable $0.5. ¿Unidades para no perder?', type: 'input', correct: 80, hint: 'Fijos=40. Ganancia por arepa=0.5. 40/0.5=80', explanation: 'Punto equilibrio = costos fijos / (precio - costo variable)' },
    { id: 6, title: 'Flujo de caja', desc: 'Vendiste 30 arepas a $1. Gastaste $10 en ingredientes y $5 en transporte. ¿Flujo de caja del día?', type: 'input', correct: 15, hint: 'Ingresos 30. Gastos 10+5=15. 30-15=15', explanation: 'Flujo de caja = ingresos - gastos' },
    { id: 7, title: 'Separar finanzas', desc: 'El negocio tiene $50. Necesitas $15 para tu casa. ¿Qué hacer?', type: 'multiple', options: ['Tomar del negocio', 'Pagar con dinero personal', 'Pedir prestado al negocio', 'Esperar'], correct: 1, hint: 'No mezclar', explanation: 'Separa siempre tus finanzas personales de las del negocio.' },
    { id: 8, title: 'Presupuesto mensual', desc: 'Proyectas vender 500 arepas a $1 c/u. Costo variable $0.5, fijos $40. ¿Ganancia neta?', type: 'input', correct: 210, hint: 'Ingresos 500. Variables 250. Fijos 40. 500-250-40=210', explanation: 'Ganancia neta = ingresos - costos variables - costos fijos' },
    { id: 9, title: 'Impuestos (IVA)', desc: 'Vendiste $500. IVA 16%. ¿Cuánto pagas de IVA?', type: 'input', correct: 80, hint: '500 × 0.16 = 80', explanation: 'El IVA es un porcentaje de tus ventas.' },
    { id: 10, title: 'Promedio de ventas', desc: 'Ventas: lunes $80, martes $95, miércoles $110. ¿Promedio?', type: 'input', correct: 95, hint: 'Suma 285 / 3 = 95', explanation: 'El promedio ayuda a proyectar.' },
    { id: 11, title: 'Préstamo e intereses', desc: 'Préstamo $1000, interés mensual 2%. ¿Total a pagar en un mes?', type: 'input', correct: 1020, hint: '1000 × 0.02 = 20. Total 1020', explanation: 'Interés = capital × tasa' },
    { id: 12, title: 'Depreciación', desc: 'Horno cuesta $240, vida útil 5 años. ¿Depreciación anual?', type: 'input', correct: 48, hint: '240 / 5 = 48', explanation: 'La depreciación es el desgaste del activo.' },
    { id: 13, title: 'Margen de contribución', desc: 'Precio $1.2, costo variable $0.5. ¿Margen de contribución unitario?', type: 'input', correct: 0.7, hint: '1.2 - 0.5 = 0.7', explanation: 'Margen = precio - costo variable' },
    { id: 14, title: 'Apalancamiento', desc: 'Deuda $2000 al 15% anual. ¿Intereses al año?', type: 'input', correct: 300, hint: '2000 × 0.15 = 300', explanation: 'Interés = deuda × tasa' },
    { id: 15, title: 'Balance básico', desc: 'Activos $3500, pasivos $1200. ¿Patrimonio?', type: 'input', correct: 2300, hint: '3500 - 1200 = 2300', explanation: 'Patrimonio = activos - pasivos' },
    { id: 16, title: 'ROI', desc: 'Inversión $100 en publicidad, ventas adicionales $150. ¿ROI en %?', type: 'input', correct: 50, hint: '(150-100)/100 × 100 = 50%', explanation: 'ROI = (ganancia - inversión)/inversión × 100' },
    { id: 17, title: 'Impuesto de renta', desc: 'Ganancia anual $1200, impuesto 35%. ¿Cuánto pagas?', type: 'input', correct: 420, hint: '1200 × 0.35 = 420', explanation: 'Impuesto de renta sobre utilidades.' },
    { id: 18, title: 'Payback', desc: 'Máquina cuesta $600, ahorro anual $160. ¿Años recuperar?', type: 'input', correct: 3.75, hint: '600 / 160 = 3.75', explanation: 'Payback = inversión / ahorro anual' },
    { id: 19, title: 'Flujo proyectado', desc: 'Ventas $200, costos $120, impuestos $20. ¿Flujo neto?', type: 'input', correct: 60, hint: '200 - 120 - 20 = 60', explanation: 'Flujo neto = ingresos - costos - impuestos' },
    { id: 20, title: 'Ticket promedio', desc: '300 ventas, ingreso total $4500. ¿Ticket promedio?', type: 'input', correct: 15, hint: '4500 / 300 = 15', explanation: 'Ticket promedio = ingreso total / número de ventas' }
];

// ============================================
// CURSOS CORTOS (3 cursos, 5 lecciones cada uno)
// ============================================
const courses = {
    emprendimiento: {
        nombre: 'Cómo emprender desde cero',
        lecciones: [
            '1. Encuentra tu idea de negocio',
            '2. Valida tu producto con clientes reales',
            '3. Calcula tus costos y precios',
            '4. Crea un plan de negocios simple',
            '5. Los primeros 100 clientes'
        ]
    },
    marketing: {
        nombre: 'Marketing para pequeños negocios',
        lecciones: [
            '1. Define tu cliente ideal',
            '2. Precio, producto, plaza, promoción',
            '3. Redes sociales gratis que funcionan',
            '4. Cómo fidelizar clientes',
            '5. Mide tus resultados'
        ]
    },
    finanzas: {
        nombre: 'Finanzas para emprendedores',
        lecciones: [
            '1. Registro de ingresos y gastos',
            '2. Punto de equilibrio en tu negocio',
            '3. Cómo ahorrar e invertir',
            '4. Impuestos básicos',
            '5. Flujo de caja proyectado'
        ]
    }
};

// ============================================
// SEGMENTOS DE ENSEÑANZA (con empresas reales)
// ============================================
const teachingSegments = [
    { id: 1, title: 'Lección de Coca-Cola', text: 'Coca-Cola comenzó vendiendo 25 botellas diarias en 1886. Su secreto: reinvertir utilidades.', quote: '"El negocio es crear valor." - Roberto Goizueta', verification: { question: '¿Qué hacía Coca-Cola con sus ganancias?', options: ['Las gastaba', 'Las reinvertía', 'Las ahorraba', 'Las donaba'], correct: 1 } },
    { id: 2, title: 'Lección de Victoria\'s Secret', text: 'El fundador no separó sus finanzas personales de las del negocio y perdió el control.', quote: '"No mezcles tus finanzas."', verification: { question: '¿Qué error cometió?', options: ['Vender caro', 'No invertir', 'Mezclar finanzas', 'Abrir muchas tiendas'], correct: 2 } },
    { id: 3, title: 'Lección de Steve Jobs', text: 'Apple reinvierte en I+D. Calidad sobre cantidad.', quote: '"El diseño es cómo funciona."', verification: { question: '¿En qué reinvertía Apple?', options: ['Publicidad', 'I+D', 'Sueldos', 'Dividendos'], correct: 1 } },
    { id: 4, title: 'Lección de McDonald\'s', text: 'Dueño de los terrenos, no solo hamburguesas. Gana por alquileres.', quote: '"Estoy en bienes raíces." - Ray Kroc', verification: { question: '¿Otra fuente de ingresos?', options: ['Juguetes', 'Alquileres', 'Café', 'Ropa'], correct: 1 } },
    { id: 5, title: 'Lección de Amazon', text: 'Reinvertía todas las ganancias para crecer, aunque tuviera pérdidas.', quote: '"Tu margen es mi oportunidad."', verification: { question: '¿Qué hacía Amazon?', options: ['Repartía ganancias', 'Reinvertía', 'Ahorraba', 'Pagaba deudas'], correct: 1 } },
    { id: 6, title: 'Lección de Zara', text: 'Controla toda la cadena para reducir costos.', quote: '"Entender al cliente."', verification: { question: '¿Qué estrategia usa?', options: ['Comprar a terceros', 'Control total', 'Solo online', 'Producir en masa'], correct: 1 } },
    { id: 7, title: 'Lección de Nike', text: 'Externaliza producción, mantiene diseño y marketing.', quote: '"Just do it."', verification: { question: '¿Qué mantiene interno?', options: ['Producción', 'Diseño y marketing', 'Distribución', 'Ventas'], correct: 1 } },
    { id: 8, title: 'Lección de Disney', text: 'Diversifica: películas, parques, productos.', quote: '"Sigue creando."', verification: { question: '¿Estrategia?', options: ['Diversificación', 'Aumentar precios', 'Reducir costos', 'Vender acciones'], correct: 0 } }
];

// ============================================
// CONSEJOS FINANCIEROS
// ============================================
const tips = [
    "Separa tus finanzas personales de las del negocio.",
    "Págate un sueldo fijo.",
    "Registra todos los gastos, por pequeños que sean.",
    "Antes de poner precio, calcula todos tus costos.",
    "Ten un fondo de emergencia (3 meses de gastos fijos).",
    "No confundas ganancia con liquidez.",
    "Reinvierte parte de tus ganancias.",
    "El IVA no es tuyo, sepáralo.",
    "Un préstamo puede ayudar, pero cuidado con los intereses.",
    "Calcula siempre tu punto de equilibrio.",
    "La depreciación es un costo real.",
    "Diversifica tus ingresos."
];
let currentTipIndex = 0;

// ============================================
// ELEMENTOS DEL DOM
// ============================================
const screens = {
    menu: document.getElementById('menu-screen'),
    map: document.getElementById('map-screen'),
    game: document.getElementById('game-screen'),
    teaching: document.getElementById('teaching-screen'),
    tips: document.getElementById('tips-screen'),
    settings: document.getElementById('settings-screen'),
    simulator: document.getElementById('simulator-screen'),
    diary: document.getElementById('diary-screen'),
    achievements: document.getElementById('achievements-screen'),
    courses: document.getElementById('courses-screen'),
    investor: document.getElementById('investor-screen'),
    backup: document.getElementById('backup-screen')
};

// ============================================
// FUNCIONES DE SONIDO, VIBRACIÓN, TEMA
// ============================================
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

function applyTheme() {
    if (darkTheme) document.body.classList.remove('light-theme');
    else document.body.classList.add('light-theme');
    localStorage.setItem('finanzapp_theme', darkTheme ? 'dark' : 'light');
}

// ============================================
// LOGROS
// ============================================
function checkAchievements() {
    if (levelsCompleted.includes(1) && !achievements.includes(1)) unlockAchievement(1);
    if (levelsCompleted.length >= 5 && !achievements.includes(2)) unlockAchievement(2);
    if (levelsCompleted.length >= 10 && !achievements.includes(3)) unlockAchievement(3);
    if (levelsCompleted.length >= 15 && !achievements.includes(4)) unlockAchievement(4);
    if (levelsCompleted.length >= 20 && !achievements.includes(5)) unlockAchievement(5);
    if (diaryEntries.length >= 10 && !achievements.includes(6)) unlockAchievement(6);
    let simCount = parseInt(localStorage.getItem('finanzapp_simcount') || '0');
    if (simCount >= 5 && !achievements.includes(7)) unlockAchievement(7);
    let lastDate = localStorage.getItem('finanzapp_lastdate');
    if (lastDate) {
        let today = new Date().toDateString();
        if (lastDate === today) {
            let streak = parseInt(localStorage.getItem('finanzapp_streak') || '1');
            if (streak >= 7 && !achievements.includes(8)) unlockAchievement(8);
        }
    }
    if (businessName !== 'Mi negocio' && !achievements.includes(9)) unlockAchievement(9);
    let investUsed = localStorage.getItem('finanzapp_investor_used') === 'true';
    if (investUsed && !achievements.includes(10)) unlockAchievement(10);
    let anyCourseCompleted = Object.values(courseProgress).some(lessons => lessons.length > 0);
    if (anyCourseCompleted && !achievements.includes(11)) unlockAchievement(11);
    updateAchievementsUI();
}

function unlockAchievement(id) {
    if (!achievements.includes(id)) {
        achievements.push(id);
        localStorage.setItem('finanzapp_achievements', JSON.stringify(achievements));
        const achievement = achievementsList.find(a => a.id === id);
        if (achievement) {
            document.getElementById('achievement-modal-text').innerText = `¡Logro: ${achievement.name}!`;
            document.getElementById('achievement-modal').classList.add('show');
            setTimeout(() => document.getElementById('achievement-modal').classList.remove('show'), 3000);
        }
        playSound('unlock');
        vibrate(200);
    }
}

function updateAchievementsUI() {
    document.getElementById('achievementCount').innerText = achievements.length;
}

// ============================================
// NAVEGACIÓN
// ============================================
function showScreen(screenId) {
    const currentActive = document.querySelector('.screen.active');
    const nextScreen = screens[screenId];
    if (!nextScreen) return;
    if (currentActive && currentActive !== nextScreen) {
        currentActive.classList.remove('active');
        currentActive.classList.add('exit-left');
        setTimeout(() => currentActive.classList.remove('exit-left'), 400);
    }
    nextScreen.classList.add('active', 'enter-right');
    setTimeout(() => nextScreen.classList.remove('enter-right'), 50);
    currentScreen = screenId;
    if (screenId === 'map') { renderMap(); updateGlobalProgress(); updateAchievementsUI(); }
    if (screenId === 'tips') showTip();
    if (screenId === 'settings') loadSettingsUI();
    if (screenId === 'simulator') initSimulator();
    if (screenId === 'diary') renderDiary();
    if (screenId === 'achievements') renderAchievements();
    if (screenId === 'courses') renderCourses();
    if (screenId === 'investor') initInvestor();
    if (screenId === 'menu') document.getElementById('userGreeting').innerText = `Hola, ${businessName}`;
}

// ============================================
// PROGRESO
// ============================================
function updateGlobalProgress() {
    const percent = Math.round((levelsCompleted.length / levels.length) * 100);
    document.getElementById('progress-percent').innerText = percent + '%';
    document.getElementById('global-progress-bar').style.width = percent + '%';
}

// ============================================
// MAPA DE NIVELES
// ============================================
function renderMap() {
    const container = document.getElementById('level-map-container');
    container.innerHTML = '';
    levels.forEach(level => {
        const completed = levelsCompleted.includes(level.id);
        const locked = level.id > levelsUnlocked;
        const node = document.createElement('div');
        node.className = `level-node ${locked ? 'locked' : ''} ${completed ? 'completed' : ''}`;
        node.dataset.level = level.id;
        node.innerHTML = `<div class="node-icon">${level.id}</div><div class="node-info"><h3>${level.title}</h3><p>${completed ? 'Completado' : (locked ? 'Bloqueado' : 'Disponible')}</p></div>${locked ? '<i class="fas fa-lock lock-icon"></i>' : ''}`;
        if (!locked) node.addEventListener('click', () => { playSound('click'); startLevel(level.id); });
        container.appendChild(node);
    });
    updateGlobalProgress();
}

// ============================================
// INICIAR NIVEL
// ============================================
function startLevel(levelId) {
    currentLevel = levelId;
    const level = levels.find(l => l.id === levelId);
    if (!level) return;
    document.getElementById('level-title').innerText = `Nivel ${level.id}: ${level.title}`;
    document.getElementById('level-description').innerText = level.desc;
    document.getElementById('question-box').innerHTML = `<i class="fas fa-lightbulb" style="color:#ffb347;"></i> ${level.explanation}`;
    const answerArea = document.getElementById('answer-area');
    answerArea.innerHTML = '';
    if (level.type === 'input') {
        answerArea.innerHTML = `<input type="number" id="answer-input" placeholder="Escribe tu respuesta..." step="any">`;
    } else if (level.type === 'multiple') {
        let html = '<div class="answer-options">';
        level.options.forEach((opt, idx) => { html += `<button class="option-btn" data-opt-index="${idx}">${opt}</button>`; });
        html += '</div>';
        answerArea.innerHTML = html;
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }
    document.getElementById('feedback').innerHTML = '';
    showScreen('game');
}

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

function isAnswerCorrect(userAns, level) {
    if (level.type === 'input') {
        if (isNaN(userAns)) return false;
        return Math.abs(userAns - level.correct) < 0.01;
    } else if (level.type === 'multiple') {
        return userAns === level.correct;
    }
    return false;
}

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
            if (level.id === levelsUnlocked && level.id < levels.length) levelsUnlocked = level.id + 1;
        }
        checkAchievements();
        startConfetti();
        showModal('¡Nivel completado!', () => {
            stopConfetti();
            if (currentLevel % 2 === 0 && currentLevel < 20) {
                const teachingIndex = Math.floor(currentLevel / 2) - 1;
                if (teachingIndex >= 0 && teachingIndex < teachingSegments.length) showTeaching(teachingIndex);
                else showScreen('map');
            } else showScreen('map');
        });
    } else {
        document.getElementById('feedback').innerHTML = `❌ Incorrecto. ${level.hint || 'Intenta de nuevo'}`;
        playSound('error');
        vibrate(300);
    }
}

// ============================================
// ENSEÑANZA
// ============================================
function showTeaching(teachingIndex) {
    if (teachingIndex < 0 || teachingIndex >= teachingSegments.length) { showScreen('map'); return; }
    const segment = teachingSegments[teachingIndex];
    document.getElementById('teachingTitle').innerText = segment.title;
    document.getElementById('teachingText').innerText = segment.text;
    document.getElementById('teachingQuote').innerHTML = `<i class="fas fa-quote-left"></i> ${segment.quote}`;
    const verif = segment.verification;
    document.getElementById('verificationQuestion').innerText = verif.question;
    let optionsHtml = '';
    verif.options.forEach((opt, idx) => { optionsHtml += `<div class="verification-option"><input type="radio" name="verification" value="${idx}" id="opt${idx}"><label for="opt${idx}">${opt}</label></div>`; });
    document.getElementById('verificationOptions').innerHTML = optionsHtml;
    document.getElementById('verificationForm').dataset.correct = verif.correct;
    showScreen('teaching');
}

function checkVerification() {
    const selected = document.querySelector('input[name="verification"]:checked');
    if (!selected) { alert('Selecciona una respuesta'); return; }
    const correct = parseInt(document.getElementById('verificationForm').dataset.correct);
    const userAnswer = parseInt(selected.value);
    if (userAnswer === correct) { playSound('success'); vibrate(100); alert('✅ ¡Correcto!'); }
    else { playSound('error'); vibrate(200); alert('❌ Incorrecto. Revisa la lección.'); }
}

// ============================================
// CONFETI
// ============================================
let confettiCanvas, ctx, confettiAnimation;
function startConfetti() {
    confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) return;
    confettiCanvas.style.display = 'block';
    ctx = confettiCanvas.getContext('2d');
    const particles = [];
    const colors = ['#ffb347', '#4caf50', '#f44336', '#2196f3', '#ffeb3b'];
    for (let i = 0; i < 100; i++) particles.push({ x: Math.random() * confettiCanvas.width, y: Math.random() * confettiCanvas.height - confettiCanvas.height, size: Math.random() * 8 + 2, speed: Math.random() * 3 + 2, color: colors[Math.floor(Math.random() * colors.length)] });
    function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        for (let p of particles) { ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); p.y += p.speed; if (p.y > confettiCanvas.height) { p.y = -10; p.x = Math.random() * confettiCanvas.width; } }
        confettiAnimation = requestAnimationFrame(draw);
    }
    draw();
}
function stopConfetti() { if (confettiAnimation) cancelAnimationFrame(confettiAnimation); if (confettiCanvas) confettiCanvas.style.display = 'none'; }

function showModal(message, callback) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-message').innerText = message;
    modal.classList.add('show');
    document.getElementById('modal-close').onclick = () => { modal.classList.remove('show'); if (callback) callback(); };
}

// ============================================
// CONSEJOS
// ============================================
function showTip() { document.getElementById('tip-text').innerText = tips[currentTipIndex]; }
function nextTip() { currentTipIndex = (currentTipIndex + 1) % tips.length; showTip(); playSound('click'); }

// ============================================
// CALCULADORA
// ============================================
let calcValue = '0', prevValue = null, operator = null, newNumber = true;
function updateCalcDisplay() { document.getElementById('calc-display').innerText = calcValue; }
function handleCalcButton(val) {
    if (val === 'C') { calcValue = '0'; prevValue = null; operator = null; newNumber = true; }
    else if (val === '←') { if (calcValue.length > 1) calcValue = calcValue.slice(0, -1); else calcValue = '0'; newNumber = false; }
    else if (val === '+' || val === '-' || val === '*' || val === '/') { if (prevValue !== null && operator) compute(); prevValue = parseFloat(calcValue); operator = val; newNumber = true; }
    else if (val === '=') { compute(); operator = null; newNumber = true; }
    else { if (newNumber) { calcValue = val === '.' ? '0.' : val; newNumber = false; } else { if (val === '.' && calcValue.includes('.')) return; calcValue += val; } }
    updateCalcDisplay();
}
function compute() { if (prevValue === null || operator === null) return; const current = parseFloat(calcValue); let result = 0; switch(operator) { case '+': result = prevValue + current; break; case '-': result = prevValue - current; break; case '*': result = prevValue * current; break; case '/': result = prevValue / current; break; } calcValue = result.toString(); prevValue = null; operator = null; }

// ============================================
// AJUSTES
// ============================================
function loadSettingsUI() {
    document.getElementById('sound-toggle').checked = soundEnabled;
    document.getElementById('vibration-toggle').checked = vibrationEnabled;
    document.getElementById('reminder-toggle').checked = reminderEnabled;
    document.getElementById('businessName').value = businessName;
    document.getElementById('theme-toggle').checked = !darkTheme;
}
function saveSettings() {
    localStorage.setItem('finanzapp_sound', soundEnabled);
    localStorage.setItem('finanzapp_vibration', vibrationEnabled);
    localStorage.setItem('finanzapp_reminder', reminderEnabled);
    localStorage.setItem('finanzapp_business', businessName);
}
function resetProgress() {
    if (confirm('¿Reiniciar todo? Se perderán niveles, diario, cursos y logros.')) {
        levelsCompleted = []; levelsUnlocked = 1; diaryEntries = []; achievements = []; courseProgress = { emprendimiento: [], marketing: [], finanzas: [] };
        localStorage.removeItem('finanzapp_completed'); localStorage.removeItem('finanzapp_diary'); localStorage.removeItem('finanzapp_achievements'); localStorage.removeItem('finanzapp_courses');
        renderMap(); playSound('click'); vibrate(100);
    }
}

// ============================================
// SIMULADOR DE NEGOCIO (con precios reales)
// ============================================
let simulatorChart;
function initSimulator() {
    document.getElementById('sim-price').value = 1.0;
    document.getElementById('sim-var-cost').value = 0.5;
    document.getElementById('sim-fixed-cost').value = 40;
    document.getElementById('sim-units').value = 500;
    calculateSimulator();
    document.getElementById('sim-calculate').addEventListener('click', calculateSimulator);
    let simCount = parseInt(localStorage.getItem('finanzapp_simcount') || '0'); simCount++; localStorage.setItem('finanzapp_simcount', simCount); checkAchievements();
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
    document.getElementById('sim-revenue').innerText = '$' + revenue.toFixed(2);
    document.getElementById('sim-var-total').innerText = '$' + totalVar.toFixed(2);
    document.getElementById('sim-fixed-total').innerText = '$' + fixedCost.toFixed(2);
    document.getElementById('sim-profit').innerText = '$' + profit.toFixed(2);
    document.getElementById('sim-breakeven').innerText = Math.ceil(breakeven) || 0;
    updateSimChart(revenue, totalVar, fixedCost, profit);
}
function updateSimChart(revenue, totalVar, fixedCost, profit) {
    const ctx = document.getElementById('simChart').getContext('2d');
    if (simulatorChart) simulatorChart.destroy();
    simulatorChart = new Chart(ctx, { type: 'bar', data: { labels: ['Ingresos', 'Costos variables', 'Costos fijos', 'Ganancia neta'], datasets: [{ label: 'Monto ($)', data: [revenue, totalVar, fixedCost, profit], backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#2196f3'], borderColor: 'white', borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { color: 'white' } }, x: { ticks: { color: 'white' } } }, plugins: { legend: { labels: { color: 'white' } } } } });
}

// ============================================
// DIARIO DE NEGOCIOS
// ============================================
function renderDiary() { updateDiarySummary(); renderDiaryEntries(); }
function updateDiarySummary() {
    const totalIncome = diaryEntries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const totalExpense = diaryEntries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
    const profit = totalIncome - totalExpense;
    document.getElementById('diary-total-income').innerText = '$' + totalIncome.toFixed(2);
    document.getElementById('diary-total-expense').innerText = '$' + totalExpense.toFixed(2);
    document.getElementById('diary-net-profit').innerText = '$' + profit.toFixed(2);
}
function renderDiaryEntries() {
    const list = document.getElementById('diary-entries-list');
    list.innerHTML = '';
    diaryEntries.slice(-10).reverse().forEach(entry => {
        const div = document.createElement('div');
        div.className = `diary-entry-item ${entry.type}`;
        div.innerHTML = `<span>${entry.desc}</span><span>$${entry.amount.toFixed(2)}</span>`;
        list.appendChild(div);
    });
}
function addDiaryEntry() {
    const type = document.getElementById('diary-type').value;
    const desc = document.getElementById('diary-desc').value.trim();
    const amount = parseFloat(document.getElementById('diary-amount').value);
    if (!desc || isNaN(amount) || amount <= 0) { alert('Completa todos los campos'); return; }
    diaryEntries.push({ type, desc, amount, date: new Date().toISOString() });
    localStorage.setItem('finanzapp_diary', JSON.stringify(diaryEntries));
    document.getElementById('diary-desc').value = '';
    document.getElementById('diary-amount').value = '';
    renderDiary(); playSound('click'); vibrate(50); checkAchievements();
}

// ============================================
// CURSOS CORTOS
// ============================================
function renderCourses() {
    const container = document.getElementById('coursesList');
    container.innerHTML = '';
    for (const [key, course] of Object.entries(courses)) {
        const completedLessons = courseProgress[key] || [];
        const percent = (completedLessons.length / course.lecciones.length) * 100;
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `<h3>${course.nombre}</h3><div class="course-progress"><div class="course-progress-fill" style="width:${percent}%"></div></div><p>${completedLessons.length}/${course.lecciones.length} lecciones</p>`;
        card.addEventListener('click', () => showCourseLessons(key));
        container.appendChild(card);
    }
}
function showCourseLessons(courseKey) {
    const course = courses[courseKey];
    const completed = courseProgress[courseKey] || [];
    let html = `<div style="padding:20px;"><h2>${course.nombre}</h2>`;
    course.lecciones.forEach((lesson, idx) => {
        const isCompleted = completed.includes(idx);
        html += `<div class="course-lesson ${isCompleted ? 'completed' : ''}" data-lesson="${idx}">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>${lesson}</span>
                        ${!isCompleted ? `<button class="complete-lesson-btn" data-course="${courseKey}" data-lesson="${idx}">Marcar completada</button>` : '<i class="fas fa-check-circle" style="color:#4caf50;"></i>'}
                    </div>
                 </div>`;
    });
    html += `<button class="back-btn" style="margin-top:20px;" id="back-from-lessons">Volver</button></div>`;
    const container = document.getElementById('coursesList');
    container.innerHTML = html;
    document.querySelectorAll('.complete-lesson-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cKey = btn.dataset.course;
            const lIdx = parseInt(btn.dataset.lesson);
            if (!courseProgress[cKey]) courseProgress[cKey] = [];
            if (!courseProgress[cKey].includes(lIdx)) {
                courseProgress[cKey].push(lIdx);
                localStorage.setItem('finanzapp_courses', JSON.stringify(courseProgress));
                showCourseLessons(cKey);
                playSound('success');
                checkAchievements();
            }
        });
    });
    document.getElementById('back-from-lessons')?.addEventListener('click', () => renderCourses());
}
function renderAchievements() {
    const container = document.getElementById('achievementsList');
    container.innerHTML = '';
    achievementsList.forEach(ach => {
        const unlocked = achievements.includes(ach.id);
        const card = document.createElement('div');
        card.className = `achievement-card ${unlocked ? 'unlocked' : ''}`;
        card.innerHTML = `<i class="fas ${ach.icon}"></i><div class="achievement-info"><h3>${ach.name}</h3><p>${ach.description}</p></div>${unlocked ? '<i class="fas fa-check-circle" style="color:#4caf50;"></i>' : '<i class="fas fa-lock" style="color:#aaa;"></i>'}`;
        container.appendChild(card);
    });
}

// ============================================
// SIMULADOR DE INVERSIONES (MODO INVERSOR)
// ============================================
let investChart;
function initInvestor() {
    document.getElementById('invest-amount').value = 100;
    document.getElementById('invest-type').value = 'stock';
    document.getElementById('invest-years').value = 5;
    calculateInvestment();
    document.getElementById('calculate-investment').addEventListener('click', calculateInvestment);
    localStorage.setItem('finanzapp_investor_used', 'true');
    checkAchievements();
}
function calculateInvestment() {
    const amount = parseFloat(document.getElementById('invest-amount').value) || 0;
    const type = document.getElementById('invest-type').value;
    const years = parseFloat(document.getElementById('invest-years').value) || 0;
    let rate = 0;
    switch(type) {
        case 'stock': rate = 0.10; break;
        case 'realestate': rate = 0.08; break;
        case 'crypto': rate = 0.25; break;
        case 'business': rate = 0.15; break;
    }
    const future = amount * Math.pow(1 + rate, years);
    const profit = future - amount;
    const roi = (profit / amount) * 100;
    document.getElementById('invest-future').innerText = '$' + future.toFixed(2);
    document.getElementById('invest-profit').innerText = '$' + profit.toFixed(2);
    document.getElementById('invest-roi').innerText = roi.toFixed(1) + '%';
    updateInvestChart(amount, future);
}
function updateInvestChart(initial, final) {
    const ctx = document.getElementById('investChart').getContext('2d');
    if (investChart) investChart.destroy();
    investChart = new Chart(ctx, { type: 'bar', data: { labels: ['Inversión inicial', 'Valor futuro'], datasets: [{ label: 'Monto ($)', data: [initial, final], backgroundColor: ['#ff9800', '#4caf50'], borderColor: 'white', borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { color: 'white' } }, x: { ticks: { color: 'white' } } }, plugins: { legend: { labels: { color: 'white' } } } } });
}

// ============================================
// RESPALDO LOCAL (JSON)
// ============================================
function exportBackup() {
    const backupData = {
        levelsCompleted, levelsUnlocked, diaryEntries, achievements, courseProgress,
        businessName, darkTheme, soundEnabled, vibrationEnabled, reminderEnabled,
        version: '1.0', date: new Date().toISOString()
    };
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finanzapp_backup_${new Date().toISOString().slice(0,19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    document.getElementById('backup-status').innerText = '✅ Respaldo exportado correctamente';
    setTimeout(() => document.getElementById('backup-status').innerText = '', 3000);
}
function importBackup(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.levelsCompleted) levelsCompleted = data.levelsCompleted;
            if (data.levelsUnlocked) levelsUnlocked = data.levelsUnlocked;
            if (data.diaryEntries) diaryEntries = data.diaryEntries;
            if (data.achievements) achievements = data.achievements;
            if (data.courseProgress) courseProgress = data.courseProgress;
            if (data.businessName) businessName = data.businessName;
            if (data.darkTheme !== undefined) darkTheme = data.darkTheme;
            if (data.soundEnabled !== undefined) soundEnabled = data.soundEnabled;
            if (data.vibrationEnabled !== undefined) vibrationEnabled = data.vibrationEnabled;
            if (data.reminderEnabled !== undefined) reminderEnabled = data.reminderEnabled;
            localStorage.setItem('finanzapp_completed', JSON.stringify(levelsCompleted));
            localStorage.setItem('finanzapp_diary', JSON.stringify(diaryEntries));
            localStorage.setItem('finanzapp_achievements', JSON.stringify(achievements));
            localStorage.setItem('finanzapp_courses', JSON.stringify(courseProgress));
            localStorage.setItem('finanzapp_business', businessName);
            localStorage.setItem('finanzapp_theme', darkTheme ? 'dark' : 'light');
            localStorage.setItem('finanzapp_sound', soundEnabled);
            localStorage.setItem('finanzapp_vibration', vibrationEnabled);
            localStorage.setItem('finanzapp_reminder', reminderEnabled);
            applyTheme();
            renderMap();
            document.getElementById('backup-status').innerText = '✅ Respaldo restaurado correctamente';
            setTimeout(() => document.getElementById('backup-status').innerText = '', 3000);
        } catch(err) { alert('Archivo inválido'); }
    };
    reader.readAsText(file);
}

// ============================================
// RASTREO DE RACHA Y RECORDATORIO
// ============================================
function trackStreak() {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('finanzapp_lastdate');
    if (lastDate === today) return;
    if (lastDate) {
        const last = new Date(lastDate);
        const diff = (new Date() - last) / (1000*60*60*24);
        let streak = parseInt(localStorage.getItem('finanzapp_streak') || '0');
        if (diff <= 1.5) { streak++; localStorage.setItem('finanzapp_streak', streak); }
        else localStorage.setItem('finanzapp_streak', '1');
    } else localStorage.setItem('finanzapp_streak', '1');
    localStorage.setItem('finanzapp_lastdate', today);
    checkAchievements();
}
function checkReminder() {
    if (!reminderEnabled) return;
    const lastReminder = localStorage.getItem('finanzapp_lastreminder');
    const today = new Date().toDateString();
    if (lastReminder !== today) {
        alert('📅 Recordatorio: Registra tus ventas de hoy en el Diario de Negocios');
        localStorage.setItem('finanzapp_lastreminder', today);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (levelsCompleted.length > 0) levelsUnlocked = Math.min(Math.max(...levelsCompleted) + 1, levels.length);
    applyTheme(); trackStreak(); checkReminder();
    document.getElementById('btn-play').addEventListener('click', () => { playSound('click'); showScreen('map'); });
    document.getElementById('btn-tips').addEventListener('click', () => { playSound('click'); showScreen('tips'); });
    document.getElementById('btn-settings').addEventListener('click', () => { playSound('click'); showScreen('settings'); });
    document.getElementById('btn-simulator').addEventListener('click', () => { playSound('click'); showScreen('simulator'); });
    document.getElementById('btn-diary').addEventListener('click', () => { playSound('click'); showScreen('diary'); });
    document.getElementById('btn-courses').addEventListener('click', () => { playSound('click'); showScreen('courses'); });
    document.getElementById('btn-investor').addEventListener('click', () => { playSound('click'); showScreen('investor'); });
    document.getElementById('back-from-map').addEventListener('click', () => { playSound('click'); showScreen('menu'); });
    document.getElementById('back-from-game').addEventListener('click', () => { playSound('click'); showScreen('map'); });
    document.getElementById('back-from-teaching').addEventListener('click', () => { playSound('click'); showScreen('map'); });
    document.getElementById('back-from-tips').addEventListener('click', () => { playSound('click'); showScreen('menu'); });
    document.getElementById('back-from-settings').addEventListener('click', () => { playSound('click'); showScreen('menu'); });
    document.getElementById('back-from-simulator').addEventListener('click', () => { playSound('click'); showScreen('menu'); });
    document.getElementById('back-from-diary').addEventListener('click', () => { playSound('click'); showScreen('menu'); });
    document.getElementById('back-from-achievements').addEventListener('click', () => { playSound('click'); showScreen('map'); });
    document.getElementById('back-from-courses').addEventListener('click', () => { playSound('click'); showScreen('menu'); });
    document.getElementById('back-from-investor').addEventListener('click', () => { playSound('click'); showScreen('menu'); });
    document.getElementById('back-from-backup').addEventListener('click', () => { playSound('click'); showScreen('menu'); });
    document.getElementById('achievementsBar').addEventListener('click', () => { playSound('click'); renderAchievements(); showScreen('achievements'); });
    document.getElementById('submit-answer').addEventListener('click', checkAnswer);
    document.getElementById('submitVerification').addEventListener('click', checkVerification);
    document.getElementById('continueAfterTeaching').addEventListener('click', () => showScreen('map'));
    document.getElementById('next-tip').addEventListener('click', nextTip);
    document.getElementById('sound-toggle').addEventListener('change', (e) => { soundEnabled = e.target.checked; saveSettings(); });
    document.getElementById('vibration-toggle').addEventListener('change', (e) => { vibrationEnabled = e.target.checked; saveSettings(); });
    document.getElementById('reminder-toggle').addEventListener('change', (e) => { reminderEnabled = e.target.checked; saveSettings(); });
    document.getElementById('theme-toggle').addEventListener('change', (e) => { darkTheme = !e.target.checked; applyTheme(); saveSettings(); checkAchievements(); });
    document.getElementById('businessName').addEventListener('change', (e) => { businessName = e.target.value.trim() || 'Mi negocio'; document.getElementById('userGreeting').innerText = `Hola, ${businessName}`; saveSettings(); checkAchievements(); });
    document.getElementById('reset-progress').addEventListener('click', resetProgress);
    document.getElementById('addDiaryEntry').addEventListener('click', addDiaryEntry);
    document.getElementById('exportSimPDF').addEventListener('click', () => alert('Función PDF disponible en versión completa'));
    document.getElementById('exportDiaryPDF').addEventListener('click', () => alert('Función PDF disponible en versión completa'));
    // Respaldo
    document.getElementById('export-backup').addEventListener('click', exportBackup);
    document.getElementById('import-backup-btn').addEventListener('click', () => document.getElementById('import-backup').click());
    document.getElementById('import-backup').addEventListener('change', (e) => { if (e.target.files[0]) importBackup(e.target.files[0]); });
    function openCalc() { document.getElementById('calc-modal').classList.add('show'); }
    document.getElementById('open-calc').addEventListener('click', openCalc);
    document.getElementById('open-calc-game').addEventListener('click', openCalc);
    document.getElementById('close-calc').addEventListener('click', () => document.getElementById('calc-modal').classList.remove('show'));
    document.querySelectorAll('.calc-btn-key').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const val = btn.dataset.value;
            if (val) handleCalcButton(val);
            else if (btn.id === 'calc-clear') handleCalcButton('C');
            else if (btn.id === 'calc-backspace') handleCalcButton('←');
            else if (btn.id === 'calc-equals') handleCalcButton('=');
        });
    });
    showScreen('menu'); renderMap(); showTip(); updateCalcDisplay(); updateAchievementsUI();
});
