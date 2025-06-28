const net = require('net');
const fs = require('fs');
const os = require('os');
const path = require('path');

const FILE_PORT = 6000;
const TEMP_DIR = path.join(os.tmpdir(), 'LANMessengerFiles');

// Ensure base temp dir exists
fs.mkdirSync(TEMP_DIR, { recursive: true });

/**
 * Starts the TCP file server to receive files from peers.
 * @param {(fromIP: string, filepath: string) => void} onFileReceived 
 */
function startFileServer(onFileReceived) {
  const server = net.createServer(socket => {
    const peerIP = socket.remoteAddress.replace(/^.*:/, ''); // Strip IPv6 prefix
    const peerDir = path.join(TEMP_DIR, peerIP);
    fs.mkdirSync(peerDir, { recursive: true });

    let fileStream = null;
    let dataStarted = false;
    let headerBuffer = Buffer.alloc(0);

    socket.on('data', chunk => {
      if (!dataStarted) {
        headerBuffer = Buffer.concat([headerBuffer, chunk]);
        const headerEndIndex = headerBuffer.indexOf('\n');

        if (headerEndIndex !== -1) {
          const headerStr = headerBuffer.slice(0, headerEndIndex).toString().trim();
          const filename = headerStr.replace(/^FILENAME:/, '').trim();
          const filepath = path.join(peerDir, filename);

          fileStream = fs.createWriteStream(filepath);
          const remainingBuffer = headerBuffer.slice(headerEndIndex + 1);
          fileStream.write(remainingBuffer);

          dataStarted = true;
          onFileReceived(peerIP, filepath);
        }
      } else {
        fileStream.write(chunk);
      }
    });

    socket.on('end', () => {
      fileStream?.end();
    });

    socket.on('error', err => {
      console.warn('⚠️ File socket error:', err.message);
    });
  });

  server.listen(FILE_PORT, () => {
    console.log(`📁 File server listening on port ${FILE_PORT}`);
  });

  server.on('error', err => {
    console.error('❌ File server error:', err.message);
  });
}

/**
 * Sends a file to a peer over TCP.
 * @param {string} ip - Destination IP
 * @param {string} filePath - Full path to the file
 */
function sendFile(ip, filePath) {
  const client = new net.Socket();
  const fileName = path.basename(filePath);
  const header = `FILENAME:${fileName}\n`;

  client.connect(FILE_PORT, ip, () => {
    const fileStream = fs.createReadStream(filePath);
    client.write(header);
    fileStream.pipe(client);
  });

  client.on('error', err => {
    console.error(`❌ Failed to send file to ${ip}:`, err.message);
  });

  client.on('close', () => {
    console.log(`✅ File sent to ${ip}`);
  });
}

/**
 * Removes all temp files received via LAN.
 */
function cleanupTempFiles() {
  try {
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
      console.log('🧹 Temporary files cleaned up.');
    }
  } catch (err) {
    console.warn('⚠️ Failed to clean temp files:', err.message);
  }
}

module.exports = {
  startFileServer,
  sendFile,
  cleanupTempFiles
};
