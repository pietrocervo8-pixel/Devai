const { exec } = require('child_process');
let say;
try {
    say = require('say');
} catch (e) {
    console.log("Módulo 'say' no instalado. Instálalo con 'npm install say' si deseas voz de sistema.");
}

// Función para hacer que la IA hable a nivel de sistema operativo
function hablarSistema(texto) {
    console.log(`IA [SISTEMA]: ${texto}`);
    if (say) {
        say.stop();
        say.speak(texto, 'Microsoft Helena', 1.0);
    }
}

// Ejemplo de bienvenida por consola y voz de sistema
console.log("Iniciando IA Pro Core...");
hablarSistema("Hola Pietro, bienvenido de nuevo. ¿Qué vamos a hacer hoy?");

// Exportar funciones para usarlas en la interfaz si lo requieres
module.exports = { hablarSistema, exec };