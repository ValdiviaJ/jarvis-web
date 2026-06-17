// ==========================================================================
// CONTROL INTERACTIVO DEL FRONTEND DE J.A.R.V.I.S.
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initSimulator();
    initGestures();
});

// ----------------------------------------------------
// SIMULADOR INTERACTIVO DE CONSOLA / DESKTOP VIRTUAL
// ----------------------------------------------------
function initSimulator() {
    const chatInput = document.getElementById("chat-input");
    const chatSend = document.getElementById("chat-send");
    const chatBody = document.getElementById("chat-body");
    const desktopScreen = document.getElementById("desktop-screen");
    const hudBadge = document.getElementById("hud-badge");

    // Diccionario de respuestas locales simuladas
    const answers = {
        "hola": "Hola, un placer saludarte. ¿Qué comando del sistema deseas ejecutar hoy?",
        "quien eres": "Soy J.A.R.V.I.S., un asistente virtual modular desarrollado originalmente en Python 3.12 y empaquetado para escritorio.",
        "creador": "Fui creado como un proyecto universitario integrando Visión por Computadora (OpenCV), Voz (pyttsx3) y modelos avanzados de lenguaje.",
        "que puedes hacer": "Puedo monitorear las estadísticas de tu PC, abrir programas como la calculadora o el bloc de notas, abrir YouTube, o chatear libremente usando Inteligencia Artificial.",
        "gracias": "A tu servicio, siempre. Es un placer ayudarte.",
    };

    function appendMessage(sender, text) {
        const msg = document.createElement("div");
        msg.classList.add("msg", sender.toLowerCase());
        msg.innerText = text;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function changeBadgeStatus(status, colorClass) {
        hudBadge.innerText = `● ${status.toUpperCase()}`;
        hudBadge.style.color = `var(--${colorClass})`;
        hudBadge.style.backgroundColor = `var(--cyan-dim)`;
    }

    function processInput(text) {
        const query = text.trim().toLowerCase();
        changeBadgeStatus("procesando", "cyan");

        setTimeout(() => {
            if (query === "/notepad" || query.includes("bloc de notas") || query.includes("notepad")) {
                appendMessage("JARVIS", "Abriendo el Bloc de Notas en tu escritorio virtual.");
                openWindow("Bloc de Notas", "notepad");
                changeBadgeStatus("standby", "cyan");
            } 
            else if (query === "/calculator" || query.includes("calculadora")) {
                appendMessage("JARVIS", "Abriendo la calculadora virtual.");
                openWindow("Calculadora", "calculator");
                changeBadgeStatus("standby", "cyan");
            } 
            else if (query === "/google" || query.includes("google")) {
                appendMessage("JARVIS", "Cargando el navegador de Google.");
                openWindow("Google Search", "google");
                changeBadgeStatus("standby", "cyan");
            } 
            else if (query === "/youtube" || query.includes("youtube")) {
                appendMessage("JARVIS", "Abriendo plataforma de YouTube.");
                openWindow("YouTube", "youtube");
                changeBadgeStatus("standby", "cyan");
            } 
            else {
                // Simular respuesta por regex o fallback a Gemini
                let matched = false;
                for (let key in answers) {
                    if (query.includes(key)) {
                        appendMessage("JARVIS", answers[key]);
                        matched = true;
                        break;
                    }
                }

                if (!matched) {
                    appendMessage("JARVIS", `[Simulación Gemini 1.5]: Entendido. He recibido tu consulta: "${text}". Para ejecutar esto de forma real en tu sistema, descarga Jarvis en el botón de abajo e introduce tu API Key.`);
                }
                changeBadgeStatus("standby", "cyan");
            }
        }, 700);
    }

    function openWindow(title, type) {
        desktopScreen.innerHTML = ""; // Limpiar pantalla anterior
        
        const win = document.createElement("div");
        win.classList.add("window-mock");

        const header = document.createElement("div");
        header.classList.add("window-header");
        header.innerHTML = `
            <span class="window-title">${title.toUpperCase()}</span>
            <div class="window-close" onclick="this.closest('.window-mock').remove()"></div>
        `;

        const content = document.createElement("div");
        content.classList.add("window-content");

        if (type === "notepad") {
            content.innerHTML = `<textarea class="notepad-txt" placeholder="Escribe tus notas aquí como si estuvieras en Windows..."></textarea>`;
        } 
        else if (type === "calculator") {
            content.innerHTML = `
                <div class="calculator-mock">
                    <div class="calc-display" id="calc-display-val">0</div>
                    <div class="calc-btn" onclick="document.getElementById('calc-display-val').innerText = '12'">12</div>
                    <div class="calc-btn" onclick="document.getElementById('calc-display-val').innerText = '34'">34</div>
                    <div class="calc-btn" onclick="document.getElementById('calc-display-val').innerText = '+'">+</div>
                    <div class="calc-btn" onclick="document.getElementById('calc-display-val').innerText = '46'" style="background: var(--cyan); color: var(--bg-deep)">=</div>
                </div>
            `;
        } 
        else if (type === "google") {
            content.innerHTML = `
                <div class="iframe-mock">
                    <div class="iframe-icon">🔍</div>
                    <div style="font-weight: bold;">Google Search</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Buscando resultados locales de red...</div>
                </div>
            `;
        } 
        else if (type === "youtube") {
            content.innerHTML = `
                <div class="iframe-mock" style="color: var(--red)">
                    <div class="iframe-icon">▶️</div>
                    <div style="font-weight: bold; color: #fff;">YouTube</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Cargando videos de demostración...</div>
                </div>
            `;
        }

        win.appendChild(header);
        win.appendChild(content);
        desktopScreen.appendChild(win);
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage("USER", text);
        chatInput.value = "";
        processInput(text);
    }

    chatSend.addEventListener("click", handleSend);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSend();
    });
}

// ----------------------------------------------------
// GESTOS INTERACTIVOS (SELECCIÓN CON MOUSE/CLICK)
// ----------------------------------------------------
function initGestures() {
    const btns = document.querySelectorAll(".gesture-btn");
    const handDisplay = document.getElementById("hand-display");
    const gestureTitle = document.getElementById("gesture-title");
    const gestureDesc = document.getElementById("gesture-desc");

    const data = {
        1: {
            icon: "☝️",
            title: "1 Dedo - Abrir YouTube",
            desc: "Al levantar un solo dedo en la cámara de tu laptop, OpenCV detecta un único defecto de convexidad y el script de Python abre automáticamente tu navegador web por defecto cargando la página de YouTube."
        },
        2: {
            icon: "✌️",
            title: "2 Dedos - Abrir Calculadora",
            desc: "Al levantar dos dedos, el sistema reconoce el gesto estable y ejecuta un subprocess en Python para abrir la aplicación nativa de la Calculadora de tu sistema de inmediato."
        },
        3: {
            icon: "🤟",
            title: "3 Dedos - Abrir Bloc de Notas",
            desc: "Levantar tres dedos inicia el comando que despliega notepad.exe directamente en Windows para que puedas apuntar notas de forma rápida sin tocar el teclado."
        },
        4: {
            icon: "🍀",
            title: "4 Dedos - Activar Micrófono",
            desc: "Este gesto inicia el protocolo de escucha de voz (STT). El reactor arc cambia a color verde y Jarvis se prepara para capturar tus órdenes de voz en español."
        },
        5: {
            icon: "🖐️",
            title: "5 Dedos - Limpiar Chat",
            desc: "Levantar la mano completa (5 dedos) envía una señal para limpiar el historial de la interfaz de chat y resetear los tokens de memoria de la conversación con Gemini."
        }
    };

    function select(num) {
        btns.forEach(btn => btn.classList.remove("active"));
        const targetBtn = document.querySelector(`.gesture-btn[data-finger="${num}"]`);
        if (targetBtn) targetBtn.classList.add("active");

        const info = data[num];
        if (info) {
            handDisplay.innerText = info.icon;
            gestureTitle.innerText = info.title;
            gestureDesc.innerText = info.desc;
        }
    }

    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            select(btn.getAttribute("data-finger"));
        });
        btn.addEventListener("mouseenter", () => {
            select(btn.getAttribute("data-finger"));
        });
    });

    select(1); // Seleccionar por defecto
}
