// ==========================================================================
// CONTROL INTERACTIVO DEL PORTAL J.A.R.V.I.S.
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initTechnicalTabs();
    initBentoGestures();
    initSimulator();
});

// ----------------------------------------------------
// NAVEGACIÓN DE PANELES TÉCNICOS (ARQUITECTURA)
// ----------------------------------------------------
function initTechnicalTabs() {
    const tabs = document.querySelectorAll(".tech-tab-btn");
    const panels = document.querySelectorAll(".tech-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remover active de botones y paneles
            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            // Activar botón seleccionado
            tab.classList.add("active");

            // Activar panel correspondiente
            const targetId = tab.getAttribute("data-tab");
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add("active");
            }
        });
    });
}

// ----------------------------------------------------
// PREVISUALIZACIÓN DE GESTOS EN BENTO GRID
// ----------------------------------------------------
function initBentoGestures() {
    const tags = document.querySelectorAll(".gesture-tag");
    const data = {
        1: "☝️ Abre YouTube en tu navegador web por defecto mediante un comando subprocess.",
        2: "✌️ Ejecuta calc.exe para abrir la calculadora de Windows.",
        3: "🤟 Lanza notepad.exe de manera local en tu PC.",
        4: "🍀 Activa el protocolo de escucha por micrófono (Speech Recognition) de forma asíncrona.",
        5: "🖐️ Limpia el historial del chat de Tkinter y vacía la memoria de la API de Gemini."
    };

    tags.forEach(tag => {
        tag.addEventListener("mouseenter", () => {
            tags.forEach(t => t.classList.remove("active"));
            tag.classList.add("active");
            
            // Si estuviéramos mostrando un tooltip dinámico, se actualizaría aquí.
            const previewNum = tag.getAttribute("data-preview");
        });
    });
}

// ----------------------------------------------------
// SIMULADOR HUD COMPLETO DEL PANEL DE CONTROL
// ----------------------------------------------------
function initSimulator() {
    // Referencias DOM
    const chatInput = document.getElementById("sim-chat-input");
    const chatSend = document.getElementById("btn-sim-send");
    const chatBox = document.getElementById("sim-chat-box");
    
    const virtualScreen = document.getElementById("sim-virtual-screen");
    const statusBadge = document.getElementById("sim-status-badge");
    const reactorRing = document.getElementById("sim-reactor-ring");
    const reactorCore = document.querySelector(".hud-core");
    
    const btnCam = document.getElementById("btn-sim-cam");
    const btnListen = document.getElementById("btn-sim-listen");
    const btnKb = document.getElementById("btn-sim-kb");
    const btnToggleAi = document.getElementById("btn-toggle-ai-mode");

    const cpuText = document.getElementById("sim-cpu-text");
    const cpuBar = document.getElementById("sim-cpu-bar");
    const ramText = document.getElementById("sim-ram-text");
    const ramBar = document.getElementById("sim-ram-bar");

    // Variables de Estado
    let aiModeActive = false;
    let cameraActive = false;
    let isListening = false;

    // Diccionario de respuestas locales simuladas
    const answers = {
        "hola": "Hola Stark. Sistemas cargados y en línea. ¿Qué comando desea ejecutar hoy?",
        "quien eres": "Soy J.A.R.V.I.S., el asistente virtual de Tony Stark. Fui desarrollado en Python 3.12 usando Tkinter y OpenCV.",
        "creador": "Fui programado por estudiantes universitarios para la automatización local de Windows mediante visión por computadora y voz.",
        "clima": "Actualmente en Huacho la temperatura es de 19 grados centígrados con cielo despejado, señor.",
        "gracias": "A su servicio, siempre. Es un placer servirle.",
        "ayuda": "Comandos disponibles: /notepad (Bloc de notas), /calculator (Calculadora), /youtube (Vídeos), /google (Buscador), /wikipedia [término], /file [archivo] o chatear libremente."
    };

    // Actualizar estadísticas de sistema dinámicamente (cada 2.5s)
    setInterval(() => {
        const cpuVal = Math.floor(Math.random() * 40) + 10;
        const ramVal = Math.floor(Math.random() * 15) + 40;
        
        cpuText.innerText = `${cpuVal}%`;
        cpuBar.style.width = `${cpuVal}%`;
        
        ramText.innerText = `${ramVal}%`;
        ramBar.style.width = `${ramVal}%`;
    }, 2500);

    // Funciones del HUD
    function appendMessage(sender, text) {
        const msg = document.createElement("div");
        msg.classList.add("sim-msg", sender.toLowerCase());
        msg.innerText = text;
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function changeHudState(state) {
        statusBadge.className = `sim-term-status-badge ${state.toLowerCase()}`;
        statusBadge.innerText = `● ${state.toUpperCase()}`;

        // Cambiar colores del reactor en base al estado
        if (state === "escuchando") {
            reactorRing.style.borderColor = "var(--green)";
            reactorRing.style.animationDuration = "8s";
            reactorCore.style.background = "radial-gradient(circle, #fff 10%, var(--green) 80%)";
            reactorCore.style.boxShadow = "0 0 25px var(--green)";
        } else if (state === "procesando") {
            reactorRing.style.borderColor = "#f59e0b";
            reactorRing.style.animationDuration = "4s";
            reactorCore.style.background = "radial-gradient(circle, #fff 10%, #f59e0b 80%)";
            reactorCore.style.boxShadow = "0 0 25px #f59e0b";
        } else if (state === "hablando") {
            reactorRing.style.borderColor = "var(--blue)";
            reactorRing.style.animationDuration = "12s";
            reactorCore.style.background = "radial-gradient(circle, #fff 10%, var(--blue) 80%)";
            reactorCore.style.boxShadow = "0 0 25px var(--blue)";
        } else { // STANDBY
            reactorRing.style.borderColor = "var(--cyan)";
            reactorRing.style.animationDuration = "25s";
            reactorCore.style.background = "radial-gradient(circle, #fff 10%, var(--cyan) 80%)";
            reactorCore.style.boxShadow = "0 0 15px var(--cyan)";
        }
    }

    function openSimWindow(title, type) {
        // Limpiar pantalla anterior
        virtualScreen.innerHTML = "";
        
        const win = document.createElement("div");
        win.classList.add("sim-window");

        const header = document.createElement("div");
        header.classList.add("sim-window-header");
        header.innerHTML = `
            <span class="sim-window-title">${title.toUpperCase()}</span>
            <div class="sim-window-close" onclick="this.closest('.sim-window').remove()"></div>
        `;

        const content = document.createElement("div");
        content.classList.add("sim-window-content");

        if (type === "notepad") {
            content.innerHTML = `<textarea class="notepad-txt" placeholder="Escribe notas de Windows aquí..." style="width:100%; height:100%; background:transparent; border:none; color:#fff; resize:none; outline:none; font-family:var(--font-mono);"></textarea>`;
        } 
        else if (type === "calculator") {
            content.innerHTML = `
                <div class="calculator-mock">
                    <div class="calc-display" id="sim-calc-display">0</div>
                    <div class="calc-btn" onclick="document.getElementById('sim-calc-display').innerText = '15'">15</div>
                    <div class="calc-btn" onclick="document.getElementById('sim-calc-display').innerText = '30'">30</div>
                    <div class="calc-btn" onclick="document.getElementById('sim-calc-display').innerText = '+'">+</div>
                    <div class="calc-btn" onclick="document.getElementById('sim-calc-display').innerText = '45'" style="background:var(--cyan); color:var(--bg-deep); font-weight:700;">=</div>
                </div>
            `;
        } 
        else if (type === "google") {
            content.innerHTML = `
                <div class="iframe-mock" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:12px;">
                    <div style="font-size:2.5rem;">🔍</div>
                    <div style="font-weight:700;">Google Search</div>
                    <div style="font-size:0.75rem; color:var(--text-muted)">Buscando en la web...</div>
                </div>
            `;
        } 
        else if (type === "youtube") {
            content.innerHTML = `
                <div class="iframe-mock" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:12px; color:var(--red);">
                    <div style="font-size:2.5rem;">▶️</div>
                    <div style="font-weight:700; color:#fff;">YouTube</div>
                    <div style="font-size:0.75rem; color:var(--text-muted)">Reproduciendo video...</div>
                </div>
            `;
        }
        else if (type === "wikipedia") {
            content.innerHTML = `
                <div style="padding:10px; font-family:sans-serif; line-height:1.4;">
                    <h4 style="color:var(--cyan); margin-bottom:8px;">Wikipedia: Resumen de consulta</h4>
                    <p style="font-size:0.8rem; color:var(--text-normal)">Wikipedia es una enciclopedia libre, políglota y editada de manera colaborativa. Es administrada por la Fundación Wikimedia...</p>
                </div>
            `;
        }

        win.appendChild(header);
        win.appendChild(content);
        virtualScreen.appendChild(win);
    }

    function processInput(text) {
        const query = text.trim().toLowerCase();
        
        changeHudState("procesando");

        setTimeout(() => {
            changeHudState("hablando");

            // Comprobar comandos barra
            if (query.startsWith("/notepad") || query.includes("bloc de notas")) {
                appendMessage("JARVIS", "Abriendo el Bloc de Notas.");
                openSimWindow("Bloc de Notas", "notepad");
            } 
            else if (query.startsWith("/calculator") || query.includes("calculadora")) {
                appendMessage("JARVIS", "Abriendo la calculadora.");
                openSimWindow("Calculadora", "calculator");
            } 
            else if (query.startsWith("/google")) {
                const search = text.substring(7).trim();
                appendMessage("JARVIS", search ? `Buscando "${search}" en Google.` : "Abriendo el buscador de Google.");
                openSimWindow("Google", "google");
            } 
            else if (query.startsWith("/youtube")) {
                const search = text.substring(8).trim();
                appendMessage("JARVIS", search ? `Buscando "${search}" en YouTube.` : "Abriendo YouTube.");
                openSimWindow("YouTube", "youtube");
            } 
            else if (query.startsWith("/wikipedia")) {
                appendMessage("JARVIS", "Buscando resumen en Wikipedia offline.");
                openSimWindow("Wikipedia", "wikipedia");
            }
            else if (query.startsWith("/file")) {
                const file = text.substring(5).trim();
                appendMessage("JARVIS", file ? `Buscando y abriendo el archivo "${file}"...` : "Por favor, especifica el nombre del archivo.");
            }
            else if (query.startsWith("/exit") || query.includes("apagar")) {
                appendMessage("JARVIS", "Apagando sistemas centrales. Adiós.");
                virtualScreen.innerHTML = '<div class="empty-screen-text">[ SISTEMA CENTRAL SHUTDOWN ]</div>';
            }
            else {
                // Respuestas conversacionales
                let matched = false;
                for (let key in answers) {
                    if (query.includes(key)) {
                        appendMessage("JARVIS", answers[key]);
                        matched = true;
                        break;
                    }
                }

                if (!matched) {
                    if (aiModeActive) {
                        appendMessage("JARVIS", `[Gemini 2.5 Flash]: Entendido, señor. He procesado su solicitud: "${text}". Para ejecutar esta instrucción directamente en su computadora real, configure su API Key en la aplicación de escritorio.`);
                    } else {
                        appendMessage("JARVIS", "No poseo un comando local registrado para esa orden. Recuerde que puede activar el modo GEMINI (IA) en el panel inferior.");
                    }
                }
            }

            setTimeout(() => {
                changeHudState("standby");
            }, 1800);

        }, 800);
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage("USER", text);
        chatInput.value = "";
        processInput(text);
    }

    // Eventos del Simulador
    chatSend.addEventListener("click", handleSend);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSend();
    });

    btnKb.addEventListener("click", () => {
        chatInput.focus();
    });

    btnToggleAi.addEventListener("click", () => {
        if (aiModeActive) {
            aiModeActive = false;
            btnToggleAi.classList.remove("gemini-mode");
            btnToggleAi.innerText = "🤖 LOCAL";
            appendMessage("SYSTEM", "Cambiando a modo de Comandos Locales (Offline).");
        } else {
            aiModeActive = true;
            btnToggleAi.classList.add("gemini-mode");
            btnToggleAi.innerText = "⚡ GEMINI";
            appendMessage("SYSTEM", "Conexión satélite Gemini IA establecida. Historial activo.");
        }
    });

    btnCam.addEventListener("click", () => {
        if (cameraActive) {
            cameraActive = false;
            virtualScreen.innerHTML = `
                <div class="empty-screen-text">
                    [ MONITOR VIRTUAL DE ESCRITORIO ]<br>
                    Ejecuta comandos barra o gestos para abrir aplicaciones simuladas en esta pantalla.
                </div>
            `;
            appendMessage("SYSTEM", "Cámara web desactivada.");
        } else {
            cameraActive = true;
            virtualScreen.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; background:#010204; border:1px solid var(--cyan); border-radius:8px;">
                    <div style="color:var(--cyan); font-family:var(--font-mono); font-size:0.8rem; margin-bottom:10px;">[ CÁMARA ACTIVA - SENSOR DE GESTOS ]</div>
                    <div style="font-size:3rem; animation: pulseEnergy 2s infinite;">🖐️</div>
                    <div style="font-size:0.7rem; color:var(--text-muted); text-align:center; margin-top:10px;">ROI de detección establecido en 40% derecho</div>
                </div>
            `;
            appendMessage("SYSTEM", "Cámara web activa. Buscando mano en el ROI...");
        }
    });

    btnListen.addEventListener("click", () => {
        if (isListening) return;
        isListening = true;
        changeHudState("escuchando");
        appendMessage("SYSTEM", "Escuchando...");
        
        setTimeout(() => {
            isListening = false;
            const fakePhrases = [
                "abre la calculadora",
                "abrir bloc de notas",
                "busca gatos graciosos en youtube",
                "quien eres tu"
            ];
            const chosen = fakePhrases[Math.floor(Math.random() * fakePhrases.length)];
            appendMessage("USER", `[Voz] ${chosen}`);
            processInput(chosen);
        }, 2500);
    });

    // Simular gestos al hacer click en los botones laterales de gestos
    const gestureBtns = document.querySelectorAll(".sim-gesture-btn");
    gestureBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            gestureBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const gNum = parseInt(btn.getAttribute("data-gesture"));
            
            if (gNum === 1) {
                appendMessage("SYSTEM", "[Gesto Detectado] 1 Dedo levantado.");
                processInput("/youtube");
            } else if (gNum === 2) {
                appendMessage("SYSTEM", "[Gesto Detectado] 2 Dedos levantados.");
                processInput("/calculator");
            } else if (gNum === 3) {
                appendMessage("SYSTEM", "[Gesto Detectado] 3 Dedos levantados.");
                processInput("/notepad");
            } else if (gNum === 4) {
                appendMessage("SYSTEM", "[Gesto Detectado] 4 Dedos levantados.");
                btnListen.click();
            } else if (gNum === 5) {
                appendMessage("SYSTEM", "[Gesto Detectado] 5 Dedos levantados.");
                chatBox.innerHTML = '<div class="sim-msg sys">Historial de chat y memoria reseteados.</div>';
            }
        });
    });
}
