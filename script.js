// ============================================
// FINANZAPP - VERSIÓN COMPLETA CORREGIDA
// 20 niveles, enseñanza, logros, diario, PDF, notificaciones, temas
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

// Sistema de logros
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
    { id: 10, name: 'Modo nocturno', description: 'Activa el tema oscuro', icon: 'fa-moon', unlocked: false }
];

// Niveles 1-20 COMPLETOS
const levels = [
    // NIVEL 1
    { 
        id: 1, 
        title: 'Costo de producción', 
        desc: 'Vas a hacer arepas de queso para vender. Compras: 1 kg de harina ($2.000), 1/2 kg de queso ($3.500) y pagas $500 de gas. ¿Cuál es el costo total de producción?', 
        type: 'input', 
        correct: 6000, 
        hint: 'Suma todo: 2000 + 3500 + 500',
        explanation: 'El costo de producción es todo lo que gastas para hacer el producto.'
    },
    // NIVEL 2
    { 
        id: 2, 
        title: 'Precio de venta', 
        desc: 'Con esa misma receta hiciste 10 arepas. El costo total fue $6.000. Quieres ganar el 40% sobre el costo. ¿A qué precio debes vender cada arepa? (Respuesta en pesos, sin decimales)', 
        type: 'input', 
        correct: 840, 
        hint: 'Primero calcula: 6000 × 0.40 = 2400 de ganancia total. Luego suma: 6000 + 2400 = 8400 total venta. Divide entre 10 arepas = 840 por arepa.',
        explanation: 'Precio = (costo total + ganancia deseada) / unidades'
    },
    // NIVEL 3
    { 
        id: 3, 
        title: 'Ganancia por unidad', 
        desc: 'Vendes cada arepa a $1.000. Sabemos que el costo de producir cada arepa es $600 (porque 6000/10). ¿Cuánto ganas por cada arepa vendida?', 
        type: 'input', 
        correct: 400, 
        hint: 'Precio venta - costo por unidad = 1000 - 600',
        explanation: 'La ganancia unitaria es lo que realmente te queda por cada venta.'
    },
    // NIVEL 4
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
        correct: 1,
        hint: 'El fijo no cambia aunque vendas poco.',
        explanation: 'Los gastos fijos como alquiler, servicios, sueldos base, se pagan incluso sin ventas.'
    },
    // NIVEL 5
    { 
        id: 5, 
        title: 'Punto de equilibrio', 
        desc: 'Tienes un negocio de arepas. Costos fijos mensuales: alquiler $50.000, servicios $20.000. Cada arepa la vendes a $1.000 y su costo variable (ingredientes) es $400. ¿Cuántas arepas debes vender al mes para no perder ni ganar?', 
        type: 'input', 
        correct: 117, 
        hint: 'Fijos totales = 70.000. Ganancia por arepa = 1000-400=600. Unidades = 70000/600 = 116.66 → redondea a 117',
        explanation: 'Punto equilibrio = costos fijos / (precio - costo variable)'
    },
    // NIVEL 6
    { 
        id: 6, 
        title: 'Flujo de caja simple', 
        desc: 'En un día vendiste 30 arepas a $1.000 cada una. Gastaste $12.000 en ingredientes y pagaste $5.000 de transporte. ¿Cuánto dinero te queda en caja al final del día?', 
        type: 'input', 
        correct: 13000, 
        hint: 'Ingresos: 30×1000 = 30000. Gastos: 12000+5000=17000. Resta: 30000-17000',
        explanation: 'Flujo de caja = ingresos del día - gastos del día'
    },
    // NIVEL 7
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
        correct: 1,
        hint: 'Nunca mezcles dinero personal con el del negocio.',
        explanation: 'Siempre separa: el dinero del negocio es para el negocio. Tú te pagas un sueldo o retiras ganancias.'
    },
    // NIVEL 8
    { 
        id: 8, 
        title: 'Presupuesto mensual', 
        desc: 'Proyectas vender 500 arepas al mes a $1.000 c/u. Tus costos variables son $400 por arepa y los fijos $70.000. ¿Cuál será tu ganancia neta del mes?', 
        type: 'input', 
        correct: 230000, 
        hint: 'Ingresos: 500×1000=500.000. Costos variables: 500×400=200.000. Fijos: 70.000. Ganancia = 500.000 - 200.000 - 70.000',
        explanation: 'Ganancia neta = ingresos - costos variables - costos fijos'
    },
    // NIVEL 9
    { 
        id: 9, 
        title: 'Impuestos básicos', 
        desc: 'Vendiste arepas por $500.000 en el mes. El impuesto a las ventas (IVA) es del 19%. ¿Cuánto debes pagar de IVA?', 
        type: 'input', 
        correct: 95000, 
        hint: '500.000 × 0.19 = 95.000',
        explanation: 'El IVA se calcula como un porcentaje de tus ventas. Debes separarlo para pagarlo.'
    },
    // NIVEL 10
    { 
        id: 10, 
        title: 'Registro de ventas diarias', 
        desc: 'Llevas un registro de ventas: Lunes $80.000, Martes $95.000, Miércoles $110.000. ¿Cuál es el promedio de ventas por día?', 
        type: 'input', 
        correct: 95000, 
        hint: 'Suma: 80000+95000+110000=285000. Divide entre 3: 95000',
        explanation: 'Llevar un registro te ayuda a proyectar y tomar decisiones.'
    },
    // NIVEL 11
    { 
        id: 11, 
        title: 'Préstamo e intereses', 
        desc: 'Pides un préstamo de $1.000.000 al banco con un interés mensual del 2%. Si lo pagas en un mes, ¿cuánto pagarás en total?', 
        type: 'input', 
        correct: 1020000, 
        hint: 'Interés = 1.000.000 × 0.02 = 20.000. Total = 1.000.000 + 20.000',
        explanation: 'Los intereses son el costo del dinero prestado.'
    },
    // NIVEL 12 - Depreciación
    { 
        id: 12, 
        title: 'Depreciación de activos', 
        desc: 'Compraste un horno industrial para las arepas en $1.200.000. Su vida útil es de 5 años. ¿Cuál es la depreciación anual? (Método lineal)', 
        type: 'input', 
        correct: 240000, 
        hint: 'Valor del activo / años de vida útil = 1.200.000 / 5',
        explanation: 'La depreciación es la pérdida de valor de un activo con el tiempo.'
    },
    // NIVEL 13 - Margen de contribución
    { 
        id: 13, 
        title: 'Margen de contribución', 
        desc: 'Vendes cada arepa a $1.200. El costo variable por arepa es $500. ¿Cuál es el margen de contribución unitario?', 
        type: 'input', 
        correct: 700, 
        hint: 'Precio - costo variable = 1200 - 500',
        explanation: 'El margen de contribución es lo que cada unidad aporta para cubrir costos fijos.'
    },
    // NIVEL 14 - Apalancamiento financiero
    { 
        id: 14, 
        title: 'Apalancamiento financiero', 
        desc: 'Tu negocio tiene $2.000.000 de deuda al 15% anual. Si tu ganancia operativa es $800.000, ¿cuánto pagas de intereses al año?', 
        type: 'input', 
        correct: 300000, 
        hint: 'Deuda × tasa = 2.000.000 × 0.15',
        explanation: 'El apalancamiento es usar deuda para potenciar resultados, pero cuidado con los intereses.'
    },
    // NIVEL 15 - Balance general básico
    { 
        id: 15, 
        title: 'Balance general', 
        desc: 'Tienes activos por $3.500.000 y pasivos por $1.200.000. ¿Cuál es tu patrimonio?', 
        type: 'input', 
        correct: 2300000, 
        hint: 'Activos - Pasivos = Patrimonio = 3.500.000 - 1.200.000',
        explanation: 'El patrimonio es lo que realmente te pertenece después de deudas.'
    },
    // NIVEL 16 - ROI (Retorno sobre inversión)
    { 
        id: 16, 
        title: 'ROI (Retorno sobre inversión)', 
        desc: 'Invertiste $500.000 en publicidad y generaste ventas adicionales por $750.000. ¿Cuál es el ROI en porcentaje? (Responde solo el número, sin %)', 
        type: 'input', 
        correct: 50, 
        hint: '(Ganancia - Inversión) / Inversión × 100 = (750.000 - 500.000) / 500.000 × 100 = 50%',
        explanation: 'El ROI mide la rentabilidad de una inversión.'
    },
    // NIVEL 17 - Impuestos avanzados
    { 
        id: 17, 
        title: 'Impuestos avanzados', 
        desc: 'Tu ganancia neta anual es $12.000.000. Pagas el 35% de impuesto de renta. ¿Cuánto pagas?', 
        type: 'input', 
        correct: 4200000, 
        hint: '12.000.000 × 0.35 = 4.200.000',
        explanation: 'El impuesto de renta se paga sobre las utilidades.'
    },
    // NIVEL 18 - Presupuesto de capital
    { 
        id: 18, 
        title: 'Presupuesto de capital', 
        desc: 'Una máquina cuesta $3.000.000 y genera ahorros anuales de $800.000. ¿En cuántos años recuperas la inversión? (Payback simple)', 
        type: 'input', 
        correct: 3.75, 
        hint: 'Inversión / ahorro anual = 3.000.000 / 800.000 = 3.75 años',
        explanation: 'El payback es el tiempo en recuperar la inversión inicial.'
    },
    // NIVEL 19 - Flujo de caja proyectado
    { 
        id: 19, 
        title: 'Flujo de caja proyectado', 
        desc: 'Proyectas ventas de $2.000.000 mensuales, costos $1.200.000, y un pago de impuestos de $200.000. ¿Cuál es el flujo de caja neto mensual?', 
        type: 'input', 
        correct: 600000, 
        hint: 'Ingresos - costos - impuestos = 2.000.000 - 1.200.000 - 200.000',
        explanation: 'El flujo de caja proyectado ayuda a planificar liquidez futura.'
    },
    // NIVEL 20 - KPIs (Indicadores clave)
    { 
        id: 20, 
        title: 'Ticket promedio', 
        desc: 'En un mes tuviste 300 ventas y un ingreso total de $4.500.000. ¿Cuál es el ticket promedio?', 
        type: 'input', 
        correct: 15000, 
        hint: 'Ingreso total / número de ventas = 4.500.000 / 300',
        explanation: 'El ticket promedio indica cuánto gasta cada cliente en promedio.'
    }
];

// Segmentos de enseñanza entre niveles (8 segmentos)
const teachingSegments = [
    {
        id: 1,
        title: 'Lección de Coca-Cola',
        text: 'Coca-Cola comenzó vendiendo solo 25 botellas al día en 1886. Hoy es una de las marcas más valiosas del mundo. Su secreto: reinvertir utilidades y mantener un control estricto de costos.',
        quote: '"El negocio no se trata de dinero, se trata de personas y de crear valor." - Roberto Goizueta (CEO Coca-Cola)',
        verification: {
            question: '¿Qué porcentaje de utilidades reinvertía Coca-Cola en sus inicios?',
            options: ['10%', '25%', '50%', 'Casi todas'],
            correct: 3
        }
    },
    {
        id: 2,
        title: 'Lección de Victoria\'s Secret',
        text: 'Victoria\'s Secret construyó un imperio entendiendo a su cliente objetivo. Su fundador, Roy Raymond, se endeudó para abrir la primera tienda, pero no separó sus finanzas personales de las del negocio y perdió el control.',
        quote: '"Aprende de los errores de otros. No mezcles tus finanzas personales con las del negocio." - Anónimo',
        verification: {
            question: '¿Qué error clave cometió el fundador de Victoria\'s Secret?',
            options: ['Vender productos caros', 'No invertir en marketing', 'Mezclar finanzas personales con las del negocio', 'Abrir muchas tiendas rápido'],
            correct: 2
        }
    },
    {
        id: 3,
        title: 'Lección de Steve Jobs',
        text: 'Steve Jobs entendía que la innovación requiere inversión. Apple mantiene altos márgenes de ganancia para reinvertir en I+D. Su lema: "Calidad es mejor que cantidad".',
        quote: '"El diseño no es solo cómo se ve, sino cómo funciona." - Steve Jobs',
        verification: {
            question: '¿En qué reinvertía Apple sus altos márgenes de ganancia?',
            options: ['Publicidad', 'I+D (Investigación y desarrollo)', 'Sueldos ejecutivos', 'Dividendos'],
            correct: 1
        }
    },
    {
        id: 4,
        title: 'Lección de McDonald\'s',
        text: 'McDonald\'s es dueño de los terrenos donde están sus franquicias, no solo del negocio de hamburguesas. Eso les da un flujo de caja constante por alquileres.',
        quote: '"No estoy en el negocio de las hamburguesas, estoy en el negocio de los bienes raíces." - Ray Kroc (fundador McDonald\'s)',
        verification: {
            question: '¿Qué otra fuente de ingresos tiene McDonald\'s además de las ventas?',
            options: ['Venta de juguetes', 'Alquiler de locales', 'Venta de café', 'Franquicias de ropa'],
            correct: 1
        }
    },
    {
        id: 5,
        title: 'Lección de Amazon',
        text: 'Amazon tuvo pérdidas durante años porque Jeff Bezos reinvertía todas las ganancias en crecer. Su enfoque: participación de mercado primero, ganancias después.',
        quote: '"Tu margen es mi oportunidad." - Jeff Bezos',
        verification: {
            question: '¿Qué hacía Amazon con sus ganancias en los primeros años?',
            options: ['Las repartía entre accionistas', 'Las reinvertía para crecer', 'Las ahorraba', 'Pagaba deudas'],
            correct: 1
        }
    },
    {
        id: 6,
        title: 'Lección de Zara (Inditex)',
        text: 'Zara controla toda su cadena de suministro para ser más eficiente. Así reduce costos y responde rápido a las tendencias.',
        quote: '"La moda no es solo ropa, es entender al cliente." - Amancio Ortega',
        verification: {
            question: '¿Qué estrategia usa Zara para reducir costos?',
            options: ['Comprar a terceros', 'Controlar toda su cadena de suministro', 'Vender solo online', 'Producir en masa'],
            correct: 1
        }
    },
    {
        id: 7,
        title: 'Lección de Nike',
        text: 'Nike externaliza la producción pero mantiene el diseño y marketing. Así tiene altos márgenes sin preocuparse por fábricas.',
        quote: '"Simplemente hazlo." - Lema de Nike',
        verification: {
            question: '¿Qué parte de su negocio mantiene Nike internamente?',
            options: ['Producción', 'Diseño y marketing', 'Distribución', 'Ventas en tiendas'],
            correct: 1
        }
    },
    {
        id: 8,
        title: 'Lección de Disney',
        text: 'Disney diversifica: películas, parques, productos. Si una fuente de ingresos falla, otras la compensan.',
        quote: '"Sigue soñando, sigue creando." - Walt Disney',
        verification: {
            question: '¿Qué estrategia usa Disney para protegerse de pérdidas?',
            options: ['Diversificación', 'Aumentar precios', 'Reducir costos', 'Vender acciones'],
            correct: 0
        }
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
    "Un préstamo puede ayudarte a crecer, pero cuidado con los intereses.",
    "Calcula siempre tu punto de equilibrio.",
    "La depreciación es un costo real, aunque no pagues efectivo.",
    "Diversifica tus fuentes de ingresos."
];
let currentTipIndex = 0;

// Elementos del DOM
const screens = {
    menu: document.getElementById('menu-screen'),
    map: document.getElementById('map-screen'),
    game: document.getElementById('game-screen'),
    teaching: document.getElementById('teaching-screen'),
    tips: document.getElementById('tips-screen'),
    settings: document.getElementById('settings-screen'),
    simulator: document.getElementById('simulator-screen'),
    diary: document.getElementById('diary-screen'),
    achievements: document.getElementById('achievements-screen')
};

// ============================================
// FUNCIONES DE SONIDO Y VIBRACIÓN
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

// ============================================
// FUNCIONES DE TEMA
// ============================================
function applyTheme() {
    if (darkTheme) {
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
    }
    localStorage.setItem('finanzapp_theme', darkTheme ? 'dark' : 'light');
}

// ============================================
// FUNCIONES DE LOGROS
// ============================================
function checkAchievements() {
    // Logro 1: Completar nivel 1
    if (levelsCompleted.includes(1) && !achievements.includes(1)) {
        unlockAchievement(1);
    }
    
    // Logro 2: Completar 5 niveles
    if (levelsCompleted.length >= 5 && !achievements.includes(2)) {
        unlockAchievement(2);
    }
    
    // Logro 3: Completar 10 niveles
    if (levelsCompleted.length >= 10 && !achievements.includes(3)) {
        unlockAchievement(3);
    }
    
    // Logro 4: Completar 15 niveles
    if (levelsCompleted.length >= 15 && !achievements.includes(4)) {
        unlockAchievement(4);
    }
    
    // Logro 5: Completar 20 niveles
    if (levelsCompleted.length >= 20 && !achievements.includes(5)) {
        unlockAchievement(5);
    }
    
    // Logro 6: 10 entradas en diario
    if (diaryEntries.length >= 10 && !achievements.includes(6)) {
        unlockAchievement(6);
    }
    
    // Logro 7: Usar simulador (se cuenta aparte)
    let simCount = parseInt(localStorage.getItem('finanzapp_simcount') || '0');
    if (simCount >= 5 && !achievements.includes(7)) {
        unlockAchievement(7);
    }
    
    // Logro 8: Racha de 7 días
    let lastDate = localStorage.getItem('finanzapp_lastdate');
    if (lastDate) {
        let today = new Date().toDateString();
        if (lastDate === today) {
            let streak = parseInt(localStorage.getItem('finanzapp_streak') || '1');
            if (streak >= 7 && !achievements.includes(8)) {
                unlockAchievement(8);
            }
        }
    }
    
    // Logro 9: Personalizar nombre
    if (businessName !== 'Mi negocio' && !achievements.includes(9)) {
        unlockAchievement(9);
    }
    
    // Logro 10: Tema oscuro
    if (!darkTheme && !achievements.includes(10)) {
        unlockAchievement(10);
    }
    
    updateAchievementsUI();
}

function unlockAchievement(id) {
    if (!achievements.includes(id)) {
        achievements.push(id);
        localStorage.setItem('finanzapp_achievements', JSON.stringify(achievements));
        
        // Mostrar modal de logro
        const achievement = achievementsList.find(a => a.id === id);
        if (achievement) {
            document.getElementById('achievement-modal-text').innerText = `¡Logro desbloqueado: ${achievement.name}!`;
            document.getElementById('achievement-modal').classList.add('show');
            setTimeout(() => {
                document.getElementById('achievement-modal').classList.remove('show');
            }, 3000);
        }
        
        playSound('unlock');
        vibrate(200);
    }
}

function updateAchievementsUI() {
    const count = achievements.length;
    document.getElementById('achievementCount').innerText = count;
}

// ============================================
// FUNCIONES DE NAVEGACIÓN
// ============================================
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
    
    // Actualizar según pantalla
    if (screenId === 'map') {
        renderMap();
        updateGlobalProgress();
        updateAchievementsUI();
    }
    if (screenId === 'tips') showTip();
    if (screenId === 'settings') loadSettingsUI();
    if (screenId === 'simulator') initSimulator();
    if (screenId === 'diary') renderDiary();
    if (screenId === 'achievements') renderAchievements();
    if (screenId === 'menu') {
        document.getElementById('userGreeting').innerText = `Hola, ${businessName}`;
    }
}

// ============================================
// FUNCIONES DE PROGRESO
// ============================================
function updateGlobalProgress() {
    const percent = Math.round((levelsCompleted.length / levels.length) * 100);
    document.getElementById('progress-percent').innerText = percent + '%';
    document.getElementById('global-progress-bar').style.width = percent + '%';
}

// ============================================
// RENDERIZAR MAPA DE NIVELES
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

// ============================================
// INICIAR NIVEL
// ============================================
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

// ============================================
// OBTENER RESPUESTA DEL USUARIO
// ============================================
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

// ============================================
// COMPARAR RESPUESTA CORRECTA
// ============================================
function isAnswerCorrect(userAns, level) {
    if (level.type === 'input') {
        if (isNaN(userAns)) return false;
        return Math.abs(userAns - level.correct) < 0.01;
    } else if (level.type === 'multiple') {
        return userAns === level.correct;
    }
    return false;
}

// ============================================
// COMPROBAR RESPUESTA
// ============================================
function checkAnswer() {
    const level = levels.find(l => l.id === currentLevel);
    if (!level) return;
    
    const userAnswer = getUserAnswer(level);
    const correct = isAnswerCorrect(userAnswer, level);
    
    if (correct) {
        document.getElementById('feedback').innerHTML = '✅ ¡Correcto! ' + (level.explanation || 'Bien hecho.');
        playSound('success');
        vibrate([100, 50, 100]);
        
        // Si el nivel no estaba completado, agregarlo y desbloquear el siguiente
        if (!levelsCompleted.includes(level.id)) {
            levelsCompleted.push(level.id);
            localStorage.setItem('finanzapp_completed', JSON.stringify(levelsCompleted));
            
            // Desbloquear siguiente nivel SOLO si este nivel es el último desbloqueado
            if (level.id === levelsUnlocked && level.id < levels.length) {
                levelsUnlocked = level.id + 1;
            }
        }
        
        checkAchievements();
        startConfetti();
        
        showModal('¡Nivel completado!', () => {
            stopConfetti();
            
            // Mostrar enseñanza después de niveles pares (2,4,6,8,10,12,14,16,18,20)
            // Pero no después del nivel 20
            if (currentLevel % 2 === 0 && currentLevel < 20) {
                // Calcular qué segmento de enseñanza mostrar (1 para nivel 2, 2 para nivel 4, etc.)
                const teachingIndex = Math.floor(currentLevel / 2) - 1;
                if (teachingIndex >= 0 && teachingIndex < teachingSegments.length) {
                    showTeaching(teachingIndex);
                    return;
                }
            }
            
            // Si no hay enseñanza, volver al mapa
            showScreen('map');
        });
    } else {
        document.getElementById('feedback').innerHTML = `❌ Incorrecto. ${level.hint || 'Intenta de nuevo'}`;
        playSound('error');
        vibrate(300);
    }
}

// ============================================
// MOSTRAR ENSEÑANZA
// ============================================
function showTeaching(teachingIndex) {
    if (teachingIndex < 0 || teachingIndex >= teachingSegments.length) {
        showScreen('map');
        return;
    }
    
    const segment = teachingSegments[teachingIndex];
    document.getElementById('teachingTitle').innerText = segment.title;
    document.getElementById('teachingText').innerText = segment.text;
    document.getElementById('teachingQuote').innerHTML = `<i class="fas fa-quote-left"></i> ${segment.quote}`;
    
    // Formulario de verificación
    const verif = segment.verification;
    document.getElementById('verificationQuestion').innerText = verif.question;
    
    let optionsHtml = '';
    verif.options.forEach((opt, idx) => {
        optionsHtml += `
            <div class="verification-option">
                <input type="radio" name="verification" value="${idx}" id="opt${idx}">
                <label for="opt${idx}">${opt}</label>
            </div>
        `;
    });
    document.getElementById('verificationOptions').innerHTML = optionsHtml;
    
    // Guardar datos para verificar después
    document.getElementById('verificationForm').dataset.correct = verif.correct;
    
    showScreen('teaching');
}

// ============================================
// VERIFICAR ENSEÑANZA
// ============================================
function checkVerification() {
    const selected = document.querySelector('input[name="verification"]:checked');
    if (!selected) {
        alert('Selecciona una respuesta');
        return;
    }
    
    const correct = parseInt(document.getElementById('verificationForm').dataset.correct);
    const userAnswer = parseInt(selected.value);
    
    if (userAnswer === correct) {
        playSound('success');
        vibrate(100);
        alert('✅ ¡Correcto! Has aprendido bien la lección.');
    } else {
        playSound('error');
        vibrate(200);
        alert('❌ Respuesta incorrecta. Revisa la lección de nuevo.');
    }
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

// ============================================
// MODAL
// ============================================
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

// ============================================
// CONSEJOS
// ============================================
function showTip() {
    document.getElementById('tip-text').innerText = tips[currentTipIndex];
}
function nextTip() {
    currentTipIndex = (currentTipIndex + 1) % tips.length;
    showTip();
    playSound('click');
}

// ============================================
// CALCULADORA
// ============================================
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
    if (confirm('¿Reiniciar todo el progreso? Se perderán niveles, diario y logros.')) {
        levelsCompleted = [];
        levelsUnlocked = 1;
        diaryEntries = [];
        achievements = [];
        localStorage.removeItem('finanzapp_completed');
        localStorage.removeItem('finanzapp_diary');
        localStorage.removeItem('finanzapp_achievements');
        renderMap();
        playSound('click');
        vibrate(100);
    }
}

// ============================================
// SIMULADOR DE NEGOCIO
// ============================================
let simulatorChart;

function initSimulator() {
    document.getElementById('sim-price').value = 1000;
    document.getElementById('sim-var-cost').value = 400;
    document.getElementById('sim-fixed-cost').value = 70000;
    document.getElementById('sim-units').value = 500;
    
    calculateSimulator();
    
    document.getElementById('sim-calculate').addEventListener('click', calculateSimulator);
    
    // Contador de uso para logro
    let simCount = parseInt(localStorage.getItem('finanzapp_simcount') || '0');
    simCount++;
    localStorage.setItem('finanzapp_simcount', simCount);
    checkAchievements();
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

// ============================================
// EXPORTAR PDF
// ============================================
function exportSimulatorPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Reporte de Simulador - FinanzApp', 20, 20);
    doc.setFontSize(12);
    doc.text(`Negocio: ${businessName}`, 20, 40);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Precio venta: $${document.getElementById('sim-price').value}`, 20, 70);
    doc.text(`Costo variable: $${document.getElementById('sim-var-cost').value}`, 20, 80);
    doc.text(`Costos fijos: $${document.getElementById('sim-fixed-cost').value}`, 20, 90);
    doc.text(`Unidades: ${document.getElementById('sim-units').value}`, 20, 100);
    doc.text(`Ingresos: ${document.getElementById('sim-revenue').innerText}`, 20, 120);
    doc.text(`Costos variables totales: ${document.getElementById('sim-var-total').innerText}`, 20, 130);
    doc.text(`Costos fijos: ${document.getElementById('sim-fixed-total').innerText}`, 20, 140);
    doc.text(`Ganancia neta: ${document.getElementById('sim-profit').innerText}`, 20, 150);
    doc.text(`Punto equilibrio: ${document.getElementById('sim-breakeven').innerText} unidades`, 20, 160);
    
    doc.save('simulador_finanzapp.pdf');
    playSound('click');
}

function exportDiaryPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Diario de Negocios - FinanzApp', 20, 20);
    doc.setFontSize(12);
    doc.text(`Negocio: ${businessName}`, 20, 40);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 50);
    
    let y = 70;
    diaryEntries.slice(-10).forEach((entry, index) => {
        const tipo = entry.type === 'income' ? 'Venta' : 'Gasto';
        doc.text(`${index+1}. ${tipo}: ${entry.desc} - $${entry.amount} (${new Date(entry.date).toLocaleDateString()})`, 20, y);
        y += 10;
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
    });
    
    doc.save('diario_finanzapp.pdf');
    playSound('click');
}

// ============================================
// DIARIO DE NEGOCIOS
// ============================================
function renderDiary() {
    updateDiarySummary();
    renderDiaryEntries();
}

function updateDiarySummary() {
    const totalIncome = diaryEntries
        .filter(e => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = diaryEntries
        .filter(e => e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0);
    const profit = totalIncome - totalExpense;
    
    document.getElementById('diary-total-income').innerText = '$' + totalIncome.toLocaleString();
    document.getElementById('diary-total-expense').innerText = '$' + totalExpense.toLocaleString();
    document.getElementById('diary-net-profit').innerText = '$' + profit.toLocaleString();
}

function renderDiaryEntries() {
    const list = document.getElementById('diary-entries-list');
    list.innerHTML = '';
    
    const recent = diaryEntries.slice(-10).reverse();
    recent.forEach(entry => {
        const div = document.createElement('div');
        div.className = `diary-entry-item ${entry.type}`;
        div.innerHTML = `
            <span>${entry.desc}</span>
            <span>$${entry.amount.toLocaleString()}</span>
        `;
        list.appendChild(div);
    });
}

function addDiaryEntry() {
    const type = document.getElementById('diary-type').value;
    const desc = document.getElementById('diary-desc').value.trim();
    const amount = parseFloat(document.getElementById('diary-amount').value);
    
    if (!desc || isNaN(amount) || amount <= 0) {
        alert('Completa todos los campos correctamente');
        return;
    }
    
    diaryEntries.push({
        type,
        desc,
        amount,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('finanzapp_diary', JSON.stringify(diaryEntries));
    
    document.getElementById('diary-desc').value = '';
    document.getElementById('diary-amount').value = '';
    
    renderDiary();
    playSound('click');
    vibrate(50);
    checkAchievements();
}

// ============================================
// LOGROS
// ============================================
function renderAchievements() {
    const container = document.getElementById('achievementsList');
    container.innerHTML = '';
    
    achievementsList.forEach(ach => {
        const unlocked = achievements.includes(ach.id);
        const card = document.createElement('div');
        card.className = `achievement-card ${unlocked ? 'unlocked' : ''}`;
        card.innerHTML = `
            <i class="fas ${ach.icon}"></i>
            <div class="achievement-info">
                <h3>${ach.name}</h3>
                <p>${ach.description}</p>
            </div>
            ${unlocked ? '<i class="fas fa-check-circle" style="color:#4caf50;"></i>' : '<i class="fas fa-lock" style="color:#aaa;"></i>'}
        `;
        container.appendChild(card);
    });
}

// ============================================
// RECORDATORIO (simulado)
// ============================================
function checkReminder() {
    if (!reminderEnabled) return;
    
    const now = new Date();
    const lastReminder = localStorage.getItem('finanzapp_lastreminder');
    const today = now.toDateString();
    
    if (lastReminder !== today) {
        // Simular notificación
        alert('📅 Recordatorio: Registra tus ventas de hoy en el Diario de Negocios');
        localStorage.setItem('finanzapp_lastreminder', today);
    }
}

// ============================================
// RASTREAR RACHA
// ============================================
function trackStreak() {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('finanzapp_lastdate');
    
    if (lastDate === today) return;
    
    if (lastDate) {
        const last = new Date(lastDate);
        const diff = (new Date() - last) / (1000 * 60 * 60 * 24);
        
        if (diff <= 1.5) {
            let streak = parseInt(localStorage.getItem('finanzapp_streak') || '0');
            streak++;
            localStorage.setItem('finanzapp_streak', streak);
        } else {
            localStorage.setItem('finanzapp_streak', '1');
        }
    } else {
        localStorage.setItem('finanzapp_streak', '1');
    }
    
    localStorage.setItem('finanzapp_lastdate', today);
    checkAchievements();
}

// ============================================
// INICIALIZACIÓN Y EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Cargar niveles desbloqueados desde el progreso guardado
    if (levelsCompleted.length > 0) {
        // El nivel desbloqueado es el siguiente al último completado
        const maxCompleted = Math.max(...levelsCompleted);
        levelsUnlocked = Math.min(maxCompleted + 1, levels.length);
    }
    
    // Aplicar tema guardado
    applyTheme();
    
    // Rastrear racha
    trackStreak();
    
    // Verificar recordatorio
    checkReminder();
    
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
    document.getElementById('btn-simulator').addEventListener('click', () => {
        playSound('click');
        showScreen('simulator');
    });
    document.getElementById('btn-diary').addEventListener('click', () => {
        playSound('click');
        showScreen('diary');
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
    document.getElementById('back-from-teaching').addEventListener('click', () => {
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
    document.getElementById('back-from-diary').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
    });
    document.getElementById('back-from-achievements').addEventListener('click', () => {
        playSound('click');
        showScreen('map');
    });
    
    // Botón de logros
    document.getElementById('achievementsBar').addEventListener('click', () => {
        playSound('click');
        renderAchievements();
        showScreen('achievements');
    });
    
    // Botón comprobar respuesta
    document.getElementById('submit-answer').addEventListener('click', checkAnswer);
    
    // Botones de enseñanza
    document.getElementById('submitVerification').addEventListener('click', checkVerification);
    document.getElementById('continueAfterTeaching').addEventListener('click', () => {
        showScreen('map');
    });
    
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
    document.getElementById('reminder-toggle').addEventListener('change', (e) => {
        reminderEnabled = e.target.checked;
        saveSettings();
    });
    document.getElementById('theme-toggle').addEventListener('change', (e) => {
        darkTheme = !e.target.checked;
        applyTheme();
        saveSettings();
        checkAchievements();
    });
    document.getElementById('businessName').addEventListener('change', (e) => {
        businessName = e.target.value.trim() || 'Mi negocio';
        document.getElementById('userGreeting').innerText = `Hola, ${businessName}`;
        saveSettings();
        checkAchievements();
    });
    document.getElementById('reset-progress').addEventListener('click', resetProgress);
    
    // Diario
    document.getElementById('addDiaryEntry').addEventListener('click', addDiaryEntry);
    
    // Exportar PDF
    document.getElementById('exportSimPDF').addEventListener('click', exportSimulatorPDF);
    document.getElementById('exportDiaryPDF').addEventListener('click', exportDiaryPDF);
    
    // Calculadora
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
    
    // Inicializar pantallas
    showScreen('menu');
    renderMap();
    showTip();
    updateCalcDisplay();
    updateAchievementsUI();
});