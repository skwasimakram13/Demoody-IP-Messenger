// network/chatService.js

const dgram = require('dgram');
const os = require('os');

const PORT = 5000;
const BROADCAST_ADDR = '255.255.255.255';

/**
 * Get the first available local IPv4 address (non-internal).
 */
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let ifaceName in interfaces) {
    const iface = interfaces[ifaceName];
    for (let i = 0; i < iface.length; i++) {
      if (iface[i].family === 'IPv4' && !iface[i].internal) {
        return iface[i].address;
      }
    }
  }
  return '127.0.0.1';
}

/**
 * Creates and starts the chat UDP broadcast service.
 * @param {(message: Object, fromIP: string) => void} onMessageReceived 
 */
function createChatService(onMessageReceived) {
  const socket = dgram.createSocket('udp4');
  const localIP = getLocalIP();

  // Bind the socket to listen for messages
  socket.bind(PORT, () => {
    socket.setBroadcast(true);
    console.log(`🔊 Chat service started on ${localIP}:${PORT}`);
  });

  // Listen for incoming broadcasted chat messages
  socket.on('message', (msgBuffer, rinfo) => {
    const senderIP = rinfo.address;
    if (senderIP === localIP) return; // skip self

    try {
      const message = JSON.parse(msgBuffer.toString());
      if (message && message.sender && message.message) {
        onMessageReceived(message, senderIP);
      }
    } catch (err) {
      console.warn('⚠️ Failed to parse chat message:', err.message);
    }
  });

  /**
   * Sends a message to all devices on the LAN via broadcast.
   * @param {string} username 
   * @param {string} text 
   */
  function sendMessage(username, text) {
    const payload = JSON.stringify({
      sender: username,
      message: text,
      time: new Date().toISOString()
    });

    const buffer = Buffer.from(payload);
    socket.send(buffer, 0, buffer.length, PORT, BROADCAST_ADDR, (err) => {
      if (err) {
        console.error('❌ Failed to send message:', err.message);
      }
    });
  }

  return {
    sendMessage
  };
}

module.exports = createChatService;
