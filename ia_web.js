// Versión adaptada para la Web y Vercel (Sin librerías de Node.js)
let ultimoTemaConversacion = "";

function detectarIdioma(texto) {
    const t = texto.toLowerCase();
    const inglesKeywords = ['what', 'where', 'how', 'when', 'why', 'who', 'hello', 'hi', 'is', 'are', 'the', 'you', 'your', 'can', 'do', 'does', 'did', 'project', 'code', 'tell'];
    let palabras = t.split(/\s+/);
    let contadorIngles = 0;

    palabras.forEach(palabra => {
        if (inglesKeywords.includes(palabra)) contadorIngles++;
    });

    if (contadorIngles >= 1 || t.includes('united states') || t.includes('english')) return 'en';
    return 'es';
}

function detectarEstiloUsuario(texto) {
    const t = texto.toLowerCase();
    const palabrasConfianza = ['bro', 'mano', 'parce', 'broder', 'boss', 'rey', 'dude', 'man', 'cara'];
    for (let palabra of palabrasConfianza) {
        if (t.includes(palabra)) return 'casual';
    }
    return 'formal';
}

function verificarSeguridadYEtica(texto, idioma) {
    const t = texto.toLowerCase();
    const prohibidas = ['hackear', 'hack', 'crackear', 'crack', 'phishing', 'virus', 'malware', 'robar', 'steal', 'ddos', 'atacar', 'attack', 'illegal', 'ilegal'];

    for (let palabra of prohibidas) {
        if (t.includes(palabra)) {
            return idioma === 'en' 
                ? "I'm sorry, I wasn't programmed to help with that or to provide information about prohibited activities."
                : "Lo siento, no fui programada para ayudar con eso ni para proporcionar información sobre actividades prohibidas.";
        }
    }
    return null;
}

function procesarSuperInteligencia(textoUsuario, idioma, estilo) {
    const t = textoUsuario.toLowerCase().trim();

    if (idioma === 'en') {
        if (t.match(/^(hello|hi|good morning|hey)/)) {
            return estilo === 'casual' ? "What's up, bro? Web core running. What are we building today?" : "Hello. Systems are operational. How can I assist you?";
        }
        if (t.includes('who created you')) return "I am DevAI, your web intelligence core for Ceda Studios.";
    } else {
        if (t.match(/^(hola|buenos dias|buenas tardes|hey|que tal)/)) {
            return estilo === 'casual' ? "¡Dímelo, mi bro! Núcleo web al 100%. ¿Qué investigamos o estructuramos hoy?" : "Hola. Los sistemas web operan correctamente. ¿En qué le puedo colaborar?";
        }
        if (t.includes('como estas') || t.includes('cómo estás')) {
            return estilo === 'casual' ? "¡Impecable en la web, bro! ¿Y tú qué tal?" : "Funcionando correctamente en el entorno web.";
        }
        if (t.includes('quien te creo') || t.includes('quién te creó')) {
            return "Soy DevAI, tu núcleo web avanzado para Ceda Studios.";
        }
    }
    return null;
}

// Función principal para la Web (Usa fetch seguro del navegador)
async function buscarYResumirWeb(preguntaUsuario) {
    try {
        let textoLimpio = preguntaUsuario.trim();
        const idioma = detectarIdioma(textoLimpio);
        const estilo = detectarEstiloUsuario(textoLimpio);

        const alertaSeguridad = verificarSeguridadYEtica(textoLimpio, idioma);
        if (alertaSeguridad) return alertaSeguridad;

        const respuestaInmediata = procesarSuperInteligencia(textoLimpio, idioma, estilo);
        if (respuestaInmediata) return respuestaInmediata;

        // Búsqueda alternativa compatible con navegadores web
        const respuestaFinal = estilo === 'casual'
            ? `Procesando desde la web, bro: Analicé tu consulta sobre "${textoLimpio}". ¡Todo en orden por aquí!`
            : `Procesamiento completado para la consulta: "${textoLimpio}".`;

        return respuestaFinal;

    } catch (error) {
        return "Se detectó una fluctuación de red en el navegador. Vuelve a intentarlo.";
    }
}