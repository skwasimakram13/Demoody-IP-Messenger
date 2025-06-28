const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const createChatService = require('./network/chatService');
const fileService = require('./network/fileService');
const startPeerDiscovery = require('./network/peerDiscovery');
const os = require('os');

let chat;
let mainWindow;

// Get local IP (used for filtering self in peer discovery)
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let iface of Object.values(interfaces)) {
    for (let i of iface) {
      if (i.family === 'IPv4' && !i.internal) return i.address;
    }
  }
  return '127.0.0.1';
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  mainWindow.loadFile('renderer/index.html');

  // Start chat service (UDP)
  chat = createChatService((msg, ip) => {
    mainWindow.webContents.send('chat-received', { ...msg, ip });
  });

  // Start file server (TCP)
  fileService.startFileServer((fromIP, filepath) => {
    mainWindow.webContents.send('file-received', { fromIP, filepath });
  });

  // Start peer discovery (UDP broadcast)
  startPeerDiscovery(peerIP => {
    const localIP = getLocalIP();
    if (peerIP !== localIP) {
      mainWindow.webContents.send('peer-found', peerIP);
    }
  });
}

// IPC: send chat message
ipcMain.on('chat-send', (e, data) => {
  if (chat) chat.sendMessage(data.username, data.message);
});

// IPC: send file to target IP
ipcMain.on('file-send', (e, data) => {
  fileService.sendFile(data.toIP, data.filePath);
});

// Cleanup temp files on exit
app.on('before-quit', () => {
  fileService.cleanupTempFiles();
});

// App ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Close app on all windows closed (except macOS)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
