// network/peerDiscovery.js
const dgram = require('dgram');
const os = require('os');

const PORT = 41234;
const BROADCAST_ADDR = '255.255.255.255';
const DISCOVERY_MESSAGE = Buffer.from('DISCOVER_LAN_CHAT');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let iface of Object.values(interfaces)) {
    for (let i of iface) {
      if (i.family === 'IPv4' && !i.internal) return i.address;
    }
  }
  return '127.0.0.1';
}

function startPeerDiscovery(onPeerDiscovered) {
  const socket = dgram.createSocket('udp4');
  const knownPeers = new Set();
  const localIP = getLocalIP();

  socket.bind(PORT, () => {
    socket.setBroadcast(true);

    // Broadcast discovery message every 5 seconds
    setInterval(() => {
      socket.send(DISCOVERY_MESSAGE, 0, DISCOVERY_MESSAGE.length, PORT, BROADCAST_ADDR);
    }, 5000);
  });

  socket.on('message', (msg, rinfo) => {
    const senderIP = rinfo.address;
    if (msg.toString() === 'DISCOVER_LAN_CHAT' && senderIP !== localIP) {
      if (!knownPeers.has(senderIP)) {
        knownPeers.add(senderIP);
        console.log(`✅ Discovered peer at ${senderIP}`);
        onPeerDiscovered(senderIP);
      }
    }
  });
}

module.exports = startPeerDiscovery;
