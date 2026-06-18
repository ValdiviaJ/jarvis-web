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
            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            tab.classList.add("active");

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

    tags.forEach(tag => {
        tag.addEventListener("mouseenter", () => {
            tags.forEach(t => t.classList.remove("active"));
            tag.classList.add("active");
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

    // Respuestas conversacionales (Sin emojis)
    const answers = {
        "hola": "Hola Stark. Sistemas cargados y en línea. ¿Qué comando desea ejecutar hoy?",
        "quien eres": "Soy J.A.R.V.I.S., el asistente virtual de Tony Stark. Fui desarrollado en Python 3.12 usando Tkinter y OpenCV.",
        "creador": "Fui programado por estudiantes universitarios para la automatización local de Windows mediante visión por computadora y voz.",
        "clima": "Actualmente en Huacho la temperatura es de 19 grados centígrados con cielo despejado, señor.",
        "gracias": "A su servicio, siempre. Es un placer servirle.",
        "ayuda": "Comandos disponibles: /notepad (Bloc de notas), /calculator (Calculadora), /youtube (Vídeos), /google (Buscador), /wikipedia [término], /file [archivo] o chatear libremente."
    };

    // Actualizar estadísticas de sistema dinámicamente
    setInterval(() => {
        const cpuVal = Math.floor(Math.random() * 30) + 10;
        const ramVal = Math.floor(Math.random() * 10) + 50;
        
        cpuText.innerText = `${cpuVal}%`;
        cpuBar.style.width = `${cpuVal}%`;
        
        ramText.innerText = `${ramVal}%`;
        ramBar.style.width = `${ramVal}%`;
    }, 2500);

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
            reactorCore.style.background = "var(--green)";
            reactorCore.style.boxShadow = "0 0 15px var(--green)";
        } else if (state === "procesando") {
            reactorRing.style.borderColor = "#f59e0b";
            reactorRing.style.animationDuration = "4s";
            reactorCore.style.background = "#f59e0b";
            reactorCore.style.boxShadow = "0 0 15px #f59e0b";
        } else if (state === "hablando") {
            reactorRing.style.borderColor = "#818cf8";
            reactorRing.style.animationDuration = "12s";
            reactorCore.style.background = "#818cf8";
            reactorCore.style.boxShadow = "0 0 15px #818cf8";
        } else { // STANDBY
            reactorRing.style.borderColor = "var(--border-color-hover)";
            reactorRing.style.animationDuration = "25s";
            reactorCore.style.background = "var(--text-primary)";
            reactorCore.style.boxShadow = "0 0 8px var(--primary)";
        }
    }

    function openSimWindow(title, type) {
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
            content.innerHTML = `<textarea class="notepad-txt" placeholder="Escribe notas de Windows aquí..." style="width:100%; height:100%; background:transparent; border:none; color:#fff; resize:none; outline:none; font-family:var(--font-mono); font-size:0.8rem;"></textarea>`;
        } 
        else if (type === "calculator") {
            content.innerHTML = `
                <div class="calculator-mock">
                    <div class="calc-display" id="sim-calc-display">0</div>
                    <div class="calc-btn" onclick="document.getElementById('sim-calc-display').innerText = '15'">15</div>
                    <div class="calc-btn" onclick="document.getElementById('sim-calc-display').innerText = '30'">30</div>
                    <div class="calc-btn" onclick="document.getElementById('sim-calc-display').innerText = '+'">+</div>
                    <div class="calc-btn" onclick="document.getElementById('sim-calc-display').innerText = '45'" style="background:var(--primary); color:#fff; font-weight:700;">=</div>
                </div>
            `;
        } 
        else if (type === "google") {
            content.innerHTML = `
                <div class="iframe-mock" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:10px; color:var(--text-secondary);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
                    <div style="font-weight:700; font-size:0.9rem;">Google Search</div>
                    <div style="font-size:0.75rem; color:var(--text-muted)">Buscando consulta en internet...</div>
                </div>
            `;
        } 
        else if (type === "youtube") {
            content.innerHTML = `
                <div class="iframe-mock" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:10px; color:var(--red);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    <div style="font-weight:700; color:#fff; font-size:0.9rem;">YouTube</div>
                    <div style="font-size:0.75rem; color:var(--text-muted)">Reproduciendo flujo de video...</div>
                </div>
            `;
        }
        else if (type === "wikipedia") {
            content.innerHTML = `
                <div style="padding:10px; font-family:var(--font-sans); line-height:1.5;">
                    <h4 style="color:var(--primary); margin-bottom:8px; font-size:0.9rem;">Resumen de Wikipedia</h4>
                    <p style="font-size:0.75rem; color:var(--text-secondary)">Wikipedia es una enciclopedia libre, políglota y editada de manera colaborativa por voluntarios...</p>
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
                virtualScreen.innerHTML = '<div class="empty-screen-text">[ SISTEMA CENTRAL APAGADO ]</div>';
            }
            else {
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
                        appendMessage("JARVIS", `[Gemini]: Procesando consulta: "${text}". Para ejecutar esto en tu PC, configure su API Key en la aplicación de escritorio.`);
                    } else {
                        appendMessage("JARVIS", "No poseo un comando local registrado para esa orden. Recuerde que puede activar el modo GEMINI en el panel inferior.");
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
            btnToggleAi.innerText = "BOT LOCAL";
            appendMessage("SYSTEM", "Cambiando a modo de Comandos Locales.");
        } else {
            aiModeActive = true;
            btnToggleAi.classList.add("gemini-mode");
            btnToggleAi.innerText = "MODO GEMINI";
            appendMessage("SYSTEM", "Conexión a Gemini establecida.");
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
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; background:#050914; border:1px solid var(--border-color); border-radius:6px; width:90%; height:90%; margin:auto;">
                    <div style="color:var(--primary); font-family:var(--font-mono); font-size:0.75rem; margin-bottom:10px;">[ CÁMARA ACTIVA - SENSOR DE GESTOS ]</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8c0 4 3 7 7 7h1c3.3 0 6-2.7 6-6v-3"/><path d="M6 14v-2a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4.7c0 3 2.3 5.3 5.3 5.3h.7"/></svg>
                    <div style="font-size:0.7rem; color:var(--text-muted); text-align:center; margin-top:10px;">ROI de detección establecido en 40% derecho</div>
                </div>
            `;
            appendMessage("SYSTEM", "Cámara web activa.");
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
                "busca videos en youtube",
                "quien eres tu"
            ];
            const chosen = fakePhrases[Math.floor(Math.random() * fakePhrases.length)];
            appendMessage("USER", `[Voz] ${chosen}`);
            processInput(chosen);
        }, 2500);
    });

    // Simular gestos
    const gestureBtns = document.querySelectorAll(".sim-gesture-btn");
    gestureBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            gestureBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const gNum = parseInt(btn.getAttribute("data-gesture"));
            
            if (gNum === 1) {
                appendMessage("SYSTEM", "Gesto 1 detectado.");
                processInput("/youtube");
            } else if (gNum === 2) {
                appendMessage("SYSTEM", "Gesto 2 detectado.");
                processInput("/calculator");
            } else if (gNum === 3) {
                appendMessage("SYSTEM", "Gesto 3 detectado.");
                processInput("/notepad");
            } else if (gNum === 4) {
                appendMessage("SYSTEM", "Gesto 4 detectado.");
                btnListen.click();
            } else if (gNum === 5) {
                appendMessage("SYSTEM", "Gesto 5 detectado.");
                chatBox.innerHTML = '<div class="sim-msg sys">Historial de chat y memoria reseteados.</div>';
            }
        });
    });
}
