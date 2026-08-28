const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const HISTORIAL_PATH = path.join(__dirname, 'historial.txt');

// Función para registrar en el historial de texto
function registrarHistorial(origen, texto) {
    const timestamp = new Date().toLocaleString();
    const linea = `[${timestamp}] ${origen}: ${texto}\n`;
    fs.appendFileSync(HISTORIAL_PATH, linea, 'utf8');
}

// Función de Diccionario rápido (Significados de palabras técnicas)
function buscarDiccionario(palabra) {
    const terminos = {
        "algoritmo": "Conjunto ordenado y finito de operaciones que permite hallar la solución a un problema.",
        "javascript": "Lenguaje de programación interpretado, dialecto estándar de ECMAScript, usado principalmente en la web.",
        "tensor": "Objeto matemático que generaliza los conceptos de escalares, vectores y matrices.",
        "electron": "Framework para crear aplicaciones de escritorio con tecnologías web (HTML, CSS, JS).",
        "nodejs": "Entorno de ejecución para JavaScript basado en el motor V8 de Google Chrome."
    };

    const limpia = palabra.toLowerCase().trim();
    if (terminos[limpia]) {
        return `📖 [DICCIONARIO]: ${limpia.toUpperCase()} -> ${terminos[limpia]}`;
    }
    return null;
}

// Función de Búsqueda Web Real estilo Google (Scraping de resultados públicos)
async function buscarEnGoogle(query) {
    try {
        console.log(`🔍 Buscando en la web: "${query}"...`);
        // Usamos DuckDuckGo HTML como motor de búsqueda rápido y libre de bloqueos de API key
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        const $ = cheerio.load(data);
        let resultados = [];

        $('.result').each((i, el) => {
            if (i < 3) { // Tomar los primeros 3 resultados relevantes
                const titulo = $(el).find('.result__title').text().trim();
                const snippet = $(el).find('.result__snippet').text().trim();
                if (titulo && snippet) {
                    resultados.push(`• ${titulo}\n  ${snippet}`);
                }
            }
        });

        if (resultados.length > 0) {
            return `🌐 [RESULTADOS DE BÚSQUEDA WEB]:\n\n${resultados.join('\n\n')}`;
        } else {
            return "No se encontraron resultados precisos en la web para esa consulta.";
        }
    } catch (error) {
        return "Error al conectar con el buscador web. Verifica tu conexión a internet.";
    }
}

// Núcleo Inteligente Principal
async function procesarConsultaInteligente(pregunta) {
    console.log(`\n> Usuario: ${pregunta}`);
    registrarHistorial('Usuario', pregunta);

    let respuestaFinal = "";

    // 1. Revisar si es una consulta de diccionario
    if (pregunta.toLowerCase().startsWith("significado de") || pregunta.toLowerCase().startsWith("que es")) {
        const palabraClave = pregunta.replace("significado de", "").replace("que es", "").trim();
        const resDiccionario = buscarDiccionario(palabraClave);
        if (resDiccionario) {
            respuestaFinal = resDiccionario;
        }
    }

    // 2. Si no está en el diccionario local, BUSCA EN GOOGLE AUTOMÁTICAMENTE
    if (!respuestaFinal) {
        respuestaFinal = await buscarEnGoogle(pregunta);
    }

    console.log(`> IA:\n${respuestaFinal}`);
    registrarHistorial('IA', respuestaFinal);
    return respuestaFinal;
}

// Prueba automática si ejecutas el script directamente
if (require.main === module) {
    (async () => {
        console.log("=== NÚCLEO CON BUSCADOR Y DICCIONARIO ACTIVO ===");
        await procesarConsultaInteligente("significado de javascript");
        await procesarConsultaInteligente("últimas noticias de inteligencia artificial 2026");
    })();
}

module.exports = { procesarConsultaInteligente };