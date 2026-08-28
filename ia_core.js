const fs = require('fs');
const path = require('path');

// Archivo de historial local
const HISTORIAL_PATH = path.join(__dirname, 'historial.txt');

// Función para registrar eventos y chat en el historial
function guardarEnHistorial(origen, texto) {
    const timestamp = new Date().toISOString();
    const entrada = `[${timestamp}] ${origen}: ${texto}\n`;
    fs.appendFileSync(HISTORIAL_PATH, entrada, 'utf8');
}

// Función principal de procesamiento de la IA (Lógica fuerte)
function procesarEntrada(promptUsuario) {
    console.log(`\n> Usuario: ${promptUsuario}`);
    guardarEnHistorial('Usuario', promptUsuario);

    let respuestaIA = "";

    // Lógica modular para comandos o respuestas inteligentes locales
    const comando = promptUsuario.toLowerCase().trim();

    if (comando === 'ayuda') {
        respuestaIA = "Comandos disponibles: 'estado', 'leer historial', 'limpiar historial', o escribe cualquier consulta para analizar.";
    } else if (comando === 'estado') {
        respuestaIA = "Núcleo de Ceda Studios operativo al 100%. Memoria y lectura de archivos estables.";
    } else if (comando === 'leer historial') {
        if (fs.existsSync(HISTORIAL_PATH)) {
            respuestaIA = fs.readFileSync(HISTORIAL_PATH, 'utf8');
        } else {
            respuestaIA = "El historial está vacío.";
        }
    } else if (comando === 'limpiar historial') {
        fs.writeFileSync(HISTORIAL_PATH, '', 'utf8');
        respuestaIA = "Historial reiniciado correctamente.";
    } else {
        // Respuesta analítica base para desarrollo
        respuestaIA = `Procesamiento exitoso para: "${promptUsuario}". Sistema listo para escalar funciones de IA o scripts personalizados.`;
    }

    console.log(`> IA: ${respuestaIA}`);
    guardarEnHistorial('IA', respuestaIA);
    return respuestaIA;
}

// Ejemplo de prueba directa al ejecutar el script con Node
if (require.main === module) {
    console.log("=== NÚCLEO DE IA CARGADO CORRECTAMENTE ===");
    procesarEntrada("estado");
}

module.exports = { procesarEntrada, guardarEnHistorial };