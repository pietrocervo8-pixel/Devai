const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const HISTORIAL_PATH = path.join(__dirname, 'historial.txt');
const MEMORIA_PATH = path.join(__dirname, 'memoria_ia.json');

let ultimoTemaConversacion = "";

function cargarMemoria() {
    if (fs.existsSync(MEMORIA_PATH)) {
        try {
            return JSON.parse(fs.readFileSync(MEMORIA_PATH, 'utf8'));
        } catch (e) {
            return {};
        }
    }
    return {};
}

function guardarEnMemoria(clave, significado) {
    const memoria = cargarMemoria();
    memoria[clave.toLowerCase().trim()] = significado;
    fs.writeFileSync(MEMORIA_PATH, JSON.stringify(memoria, null, 2), 'utf8');
}

function guardarHistorial(pregunta, respuesta) {
    const timestamp = new Date().toLocaleString();
    const contenido = `[${timestamp}] Usuario: ${pregunta}\n[${timestamp}] DevAI: ${respuesta}\n-----------------------------------\n`;
    fs.appendFileSync(HISTORIAL_PATH, contenido, 'utf8');
}

// 🌐 DETECTOR DE IDIOMA REAL Y ROBUSTO
function detectarIdioma(texto) {
    const t = texto.toLowerCase();
    
    // Palabras comunes en inglés para forzar el cambio de idioma inmediatamente
    const inglesKeywords = ['what', 'where', 'how', 'when', 'why', 'who', 'hello', 'hi', 'is', 'are', 'the', 'you', 'your', 'can', 'do', 'does', 'did', 'project', 'code', 'tell'];
    
    let palabras = t.split(/\s+/);
    let contadorIngles = 0;

    palabras.forEach(palabra => {
        if (inglesKeywords.includes(palabra)) {
            contadorIngles++;
        }
    });

    // Si detecta al menos 1 palabra clave fuerte en inglés, responde en inglés
    if (contadorIngles >= 1 || t.includes('united states') || t.includes('english')) {
        return 'en';
    }

    return 'es'; // Por defecto español
}

// 🪞 DETECTOR DE ESTILO (Casual vs Formal)
function detectarEstiloUsuario(texto) {
    const t = texto.toLowerCase();
    const palabrasConfianza = ['bro', 'mano', 'parce', 'broder', 'boss', 'rey', 'dude', 'man', 'cara'];
    
    for (let palabra of palabrasConfianza) {
        if (t.includes(palabra)) return 'casual';
    }
    return 'formal';
}

// 🛡️ FILTRO DE SEGURIDAD MULTILINGÜE
function verificarSeguridadYEtica(texto, idioma) {
    const t = texto.toLowerCase();
    const prohibidas = [
        'hackear', 'hack', 'crackear', 'crack', 'phishing', 'virus', 'malware', 
        'trojan', 'robar', 'steal', 'doxxing', 'ddos', 'atacar', 'attack', 'illegal', 'ilegal'
    ];

    for (let palabra of prohibidas) {
        if (t.includes(palabra)) {
            if (idioma === 'en') return "I'm sorry, I wasn't programmed to help with that or to provide information about prohibited or malicious activities.";
            return "Lo siento, no fui programada para ayudar con eso ni para proporcionar información sobre actividades prohibidas o maliciosas.";
        }
    }
    return null;
}

// 🧠 RESPUESTA CAMALEÓNICA
function procesarSuperInteligencia(textoUsuario, idioma, estilo) {
    const t = textoUsuario.toLowerCase().trim();

    if (idioma === 'en') {
        if (t.match(/^(hello|hi|good morning|hey)/)) {
            return estilo === 'casual' 
                ? "What's up, bro? Systems running at 100%. What are we building today?" 
                : "Hello. Systems are fully operational. How can I assist you today?";
        }
        if (t.includes('who created you')) {
            return "I am DevAI, your advanced neural intelligence core.";
        }
    } else {
        if (t.match(/^(hola|buenos dias|buenas tardes|hey|que tal)/)) {
            return estilo === 'casual'
                ? "¡Dímelo, mi bro! Sistemas al 100% y listos para romperla. ¿Qué investigamos o estructuramos hoy?"
                : "Hola. Los sistemas se encuentran 100% operativos. ¿En qué le puedo colaborar el día de hoy?";
        }
        if (t.includes('como estas') || t.includes('cómo estás')) {
            return estilo === 'casual'
                ? "¡Impecable y sin fallos, bro! ¿Y tú qué tal?"
                : "Funcionando correctamente y con los parámetros óptimos. ¿Cómo se encuentra?";
        }
        if (t.includes('quien te creo') || t.includes('quién te creó')) {
            return "Soy DevAI, tu núcleo de inteligencia artificial avanzado para Ceda Studios.";
        }
    }
    return null;
}

// NÚCLEO NATIVO Y ADAPTATIVO
async function buscarYResumir(preguntaUsuario) {
    try {
        let textoLimpio = preguntaUsuario.trim();
        const idioma = detectarIdioma(textoLimpio);
        const estilo = detectarEstiloUsuario(textoLimpio);

        // 1. Seguridad
        const alertaSeguridad = verificarSeguridadYEtica(textoLimpio, idioma);
        if (alertaSeguridad) {
            guardarHistorial(preguntaUsuario, alertaSeguridad);
            return alertaSeguridad;
        }

        // 2. Charla casual
        const respuestaInmediata = procesarSuperInteligencia(textoLimpio, idioma, estilo);
        if (respuestaInmediata) {
            guardarHistorial(preguntaUsuario, respuestaInmediata);
            return respuestaInmediata;
        }

        // 3. Contexto dinámico
        if (textoLimpio.length < 25 && ultimoTemaConversacion && !textoLimpio.toLowerCase().includes("hola")) {
            textoLimpio = `${ultimoTemaConversacion} ${textoLimpio}`;
        } else if (textoLimpio.length >= 15) {
            ultimoTemaConversacion = preguntaUsuario;
        }

        // 4. Memoria permanente
        const memoriaActual = cargarMemoria();
        const claveBusqueda = textoLimpio.toLowerCase().replace("que es", "").replace("what is", "").trim();
        if (memoriaActual[claveBusqueda]) {
            const respMem = memoriaActual[claveBusqueda];
            guardarHistorial(preguntaUsuario, respMem);
            return respMem;
        }

        // 5. Búsqueda web profunda
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(textoLimpio)}`;
        const { data } = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
            }
        });

        const $ = cheerio.load(data);
        let fragmentos = [];

        $('.result').each((i, el) => {
            if (i < 4) {
                const snippet = $(el).find('.result__snippet').text().trim();
                if (snippet && !snippet.toLowerCase().includes("marketplace") && !snippet.toLowerCase().includes("buy and sell")) {
                    fragmentos.push(snippet);
                }
            }
        });

        if (fragmentos.length === 0) {
            let errorMsg = idioma === 'en' 
                ? "I couldn't find exact data on that. Give me a bit more context."
                : (estilo === 'casual' 
                    ? "No hallé datos exactos sobre eso en los registros, bro. Desglosame un poco más el contexto." 
                    : "No se encontraron registros precisos al respecto. Por favor, proporcione más contexto.");
            
            guardarHistorial(preguntaUsuario, errorMsg);
            return errorMsg;
        }

        let contenidoBase = fragmentos.join(" ");
        
        let respuestaFinal = "";
        if (idioma === 'en') {
            respuestaFinal = estilo === 'casual'
                ? `Here is the full analysis for your query:\n\n${contenidoBase}\n\nNeed me to break down anything else, bro?`
                : `Here is the detailed analysis regarding your query:\n\n${contenidoBase}\n\nPlease let me know if you require further technical details.`;
        } else {
            respuestaFinal = estilo === 'casual'
                ? `Procesando la información con precisión, aquí tienes el análisis completo:\n\n${contenidoBase}\n\n¿Quieres que profundicemos en algo más, bro?`
                : `A continuación, presento el análisis detallado obtenido de los registros:\n\n${contenidoBase}\n\n¿Requiere que desglose algún aspecto adicional sobre este tema?`;
        }

        guardarHistorial(preguntaUsuario, respuestaFinal);
        return respuestaFinal;

    } catch (error) {
        let errNet = "Se detectó una fluctuación de red. Vuelve a intentarlo.";
        return errNet;
    }
}

module.exports = { buscarYResumir };