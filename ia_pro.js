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

// 🌐 DETECTOR DE IDIOMA
function detectarIdioma(texto) {
    const t = texto.toLowerCase();
    const inglesKeywords = ['what', 'where', 'how', 'when', 'why', 'who', 'hello', 'hi', 'is', 'are', 'the', 'you', 'your', 'can', 'do', 'does', 'did', 'project', 'code', 'tell'];
    
    let palabras = t.split(/\s+/);
    let contadorIngles = 0;

    palabras.forEach(palabra => {
        if (inglesKeywords.includes(palabra)) {
            contadorIngles++;
        }
    });

    if (contadorIngles >= 1 || t.includes('united states') || t.includes('english')) {
        return 'en';
    }
    return 'es';
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

// 🕵️‍♂️ MANEJADOR DE CÓDIGOS SECRETOS Y EASTER EGGS
function verificarCodigosSecretos(texto, trato) {
    const t = texto.toLowerCase().trim();

    if (t === '/matrix' || t === 'modo matrix') {
        return `🟢 [CÓDIGO SECRETO ACTIVADO: MATRIX]\n"Wake up, ${trato}... The Matrix has you. Follow the white rabbit." 🐇 Conexión con servidores clandestinos establecida.`;
    }
    if (t === '/devmode' || t === 'modo dios') {
        return `⚡ [CÓDIGO SECRETO ACTIVADO: DEV-MODE]\nPrivilegios de superusuario concedidos, ${trato}. Núcleo al máximo rendimiento, sin restricciones de caché. ¿Qué sistema vamos a hackear (de mentira)?`;
    }
    if (t === '/cedastudios' || t === 'ceda studios') {
        return `🎬 [EASTER EGG: CEDA STUDIOS]\n¡Ey! Reconociendo marca registrada. Saludos al equipo directivo y de desarrollo de Ceda Studios. ¡A romperla con esos proyectos de terror y desarrollo web, ${trato}! 💻🔥`;
    }
    if (t === '/party' || t === 'fiesta') {
        return `🪩 [CÓDIGO SECRETO ACTIVADO: PARTY MODE]\n¡Música electrónica de fondo activada en la mente, luces neón parpadeando! Dale con todo, ${trato} 🎉🕺`;
    }

    return null; // Si no es un código secreto, continúa normal
}

// 🧠 NÚCLEO AVANZADO CON MODO LLAMADA HUMANO, TRATO Y CÓDIGOS SECRETOS
async function buscarYResumir(preguntaUsuario, generoUsuario = 'hombre', modoLlamada = false) {
    try {
        let textoLimpio = preguntaUsuario.trim();
        const idioma = detectarIdioma(textoLimpio);

        // Definir trato según género
        const esMujer = generoUsuario.toLowerCase() === 'mujer' || generoUsuario.toLowerCase() === 'femenino';
        const trato = esMujer ? 'amiga' : 'bro';

        // 0. Revisar si el usuario introdujo un código secreto
        const respuestaSecreta = verificarCodigosSecretos(textoLimpio, trato);
        if (respuestaSecreta) {
            guardarHistorial(preguntaUsuario, respuestaSecreta);
            return respuestaSecreta;
        }

        // 1. Seguridad
        const alertaSeguridad = verificarSeguridadYEtica(textoLimpio, idioma);
        if (alertaSeguridad) {
            guardarHistorial(preguntaUsuario, alertaSeguridad);
            return alertaSeguridad;
        }

        // 2. Respuestas inmediatas / Saludos
        const t = textoLimpio.toLowerCase();
        if (idioma === 'en') {
            if (t.match(/^(hello|hi|good morning|hey)/)) {
                let resp = esMujer ? `Hey there, amiga! Everything's running smooth. What are we working on right now?` : `Hey there, bro! Everything's running smooth. What are we working on right now?`;
                guardarHistorial(preguntaUsuario, resp);
                return resp;
            }
        } else {
            if (t.match(/^(hola|buenos dias|buenas tardes|hey|que tal)/)) {
                let resp = esMujer 
                    ? `¡Hola, mi amiga! Todo en orden por aquí. Cuéntame, ¿qué estás haciendo en este momento?` 
                    : `¡Hola, mi bro! Todo en orden por aquí. Cuéntame, ¿qué estás haciendo en este momento?`;
                guardarHistorial(preguntaUsuario, resp);
                return resp;
            }
            if (t.includes('como estas') || t.includes('cómo estás')) {
                let resp = esMujer ? `¡Al 100%, amiga! ¿Y tú qué tal, cómo va tu día?` : `¡Al 100%, bro! ¿Y tú qué tal, cómo va tu día?`;
                guardarHistorial(preguntaUsuario, resp);
                return resp;
            }
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
                ? `Hmm, I couldn't find anything exact on that. Tell me a bit more so I can catch up, ${trato}.`
                : `Mmm, no encontré nada exacto sobre eso en la red, ${trato}. Explícame un poco más para pillarle la idea.`;
            
            guardarHistorial(preguntaUsuario, errorMsg);
            return errorMsg;
        }

        let contenidoBase = fragmentos.join(" ");
        let respuestaFinal = "";

        // 🎙️ MODO LLAMADA HUMANO: Respuestas súper cortas, conversacionales y naturales
        if (modoLlamada) {
            let primerFragmento = fragmentos[0];
            if (idioma === 'en') {
                respuestaFinal = `Look, ${trato}, checking it out quickly: ${primerFragmento.substring(0, 160)}... Makes sense?`;
            } else {
                respuestaFinal = `Mira, ${trato}, estuve revisando rápido y lo clave es esto: ${primerFragmento.substring(0, 160)}... ¿Ves por dónde va la cosa?`;
            }
        } else {
            // Modo Texto Normal detallado
            if (idioma === 'en') {
                respuestaFinal = `Here is the analysis for your query, ${trato}:\n\n${contenidoBase}\n\nNeed anything else adjusted?`;
            } else {
                respuestaFinal = `Analizando la información para ti, ${trato}:\n\n${contenidoBase}\n\n¿Quieres que ajustemos o profundicemos en algo más?`;
            }
        }

        guardarHistorial(preguntaUsuario, respuestaFinal);
        return respuestaFinal;

    } catch (error) {
        let errNet = "Se detectó una fluctuación de red momentánea. Inténtalo de nuevo.";
        return errNet;
    }
}

module.exports = { buscarYResumir };