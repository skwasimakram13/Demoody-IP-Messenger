const messagesDiv = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const targetIPInput = document.getElementById('targetIP');
const fileInput = document.getElementById('fileInput');
const peerList = document.getElementById('peers'); // Optional: a container for discovered peers

/**
 * Prefill username field with local IP on load
 */
window.addEventListener('DOMContentLoaded', () => {
  const ip = window.lanAPI.getLocalIP();
  usernameInput.value = ip;
  document.getElementById('sendBtn').addEventListener('click', send);
});

/**
 * Append a chat or info message to the message window.
 */
function appendMessage(data) {
  const div = document.createElement('div');
  div.className = 'message';
  div.innerHTML = `[${new Date(data.time).toLocaleTimeString()}] <b>${data.sender}</b> (${data.ip}): ${data.message}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/**
 * Handle incoming chat message
 */
window.lanChat.onMessage((msg) => {
  appendMessage(msg);
});

/**
 * Send chat message from input fields
 */
function send() {
  const username = usernameInput.value.trim();
  const message = messageInput.value.trim();
  if (!username || !message) return;

  window.lanChat.sendMessage(username, message);
  appendMessage({ sender: 'You', message, time: new Date().toISOString(), ip: 'localhost' });
  messageInput.value = '';
}

/**
 * Send selected file to the specified peer IP
 */
function sendFile() {
  const file = fileInput.files[0];
  const ip = targetIPInput.value.trim();

  if (!file || !ip) return alert('Please select a file and enter target IP address.');

  window.lanChat.sendFile(ip, file.path);

  const div = document.createElement('div');
  div.className = 'file-sent';
  div.innerHTML = `📤 Sent file <b>${file.name}</b> to <i>${ip}</i>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/**
 * Display incoming file info and open link
 */
window.lanChat.onFile(({ fromIP, filepath }) => {
  const name = filepath.split(/[\\/]/).pop();
  const div = document.createElement('div');
  div.className = 'file-received';
  div.innerHTML = `📥 <b>${name}</b> received from <i>${fromIP}</i><br>
    <a href="file://${filepath}" target="_blank">Open File</a>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

/**
 * Add newly discovered peer to a live list (optional UI feature)
 */
window.lanChat.onPeer((ip) => {
  if (!peerList) return;

  const exists = [...peerList.children].some(el => el.textContent === ip);
  if (exists) return;

  const item = document.createElement('div');
  item.className = 'peer';
  item.textContent = ip;
  item.onclick = () => {
    targetIPInput.value = ip;
  };
  peerList.appendChild(item);
});
