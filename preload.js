// const { contextBridge, ipcRenderer } = require('electron');

// // Expose safe APIs to renderer
// contextBridge.exposeInMainWorld('lanChat', {
//   // Send chat message
//   sendMessage: (username, message) => ipcRenderer.send('chat-send', { username, message }),

//   // Receive chat message
//   onMessage: (callback) => ipcRenderer.on('chat-received', (event, msg) => callback(msg)),

//   // Send file to IP
//   sendFile: (toIP, filePath) => ipcRenderer.send('file-send', { toIP, filePath }),

//   // Receive file
//   onFile: (callback) => ipcRenderer.on('file-received', (event, data) => callback(data)),

//   // Discovered peer
//   onPeer: (callback) => ipcRenderer.on('peer-found', (event, ip) => callback(ip))
// });


const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');

// Expose LAN chat & file functions
contextBridge.exposeInMainWorld('lanChat', {
  // Send chat message
  sendMessage: (username, message) => ipcRenderer.send('chat-send', { username, message }),

  // Receive chat message
  onMessage: (callback) => ipcRenderer.on('chat-received', (event, msg) => callback(msg)),

  // Send file to IP
  sendFile: (toIP, filePath) => ipcRenderer.send('file-send', { toIP, filePath }),

  // Receive file
  onFile: (callback) => ipcRenderer.on('file-received', (event, data) => callback(data)),

  // Discovered peer
  onPeer: (callback) => ipcRenderer.on('peer-found', (event, ip) => callback(ip))
});

// Expose LAN IP getter
contextBridge.exposeInMainWorld('lanAPI', {
  getLocalIP: () => {
    const interfaces = os.networkInterfaces();
    for (let iface of Object.values(interfaces)) {
      for (let i of iface) {
        if (i.family === 'IPv4' && !i.internal) {
          return i.address;
        }
      }
    }
    return '0.0.0.0';
  }
});
