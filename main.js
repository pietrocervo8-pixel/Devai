const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1100,
        height: 750,
        icon: path.join(__dirname, 'icon.ico'), // Opcional si tienes ícono
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Carga tu archivo visual principal
    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.on('window-all-closed', () => { app.quit(); });
    }
});