
# 📡 Demoody IP Messenger

A **LAN-based group chat and file transfer desktop app** for Windows, built using **Electron**. Communicate with other users on the same Wi-Fi or local network — no internet or server required.

---

## 🚀 Features

- 🧑‍🤝‍🧑 Auto-discovers peers on the same LAN
- 💬 Group chat with timestamps and device IPs
- 📁 Send files of any type to other peers
- 📴 Automatically deletes files and messages on exit
- ⚙️ Built with Electron — clean native app experience

---

## 📷 Screenshots

> _(Add screenshots here later: chat UI, file sharing, peer list)_

---

## 🏗️ Project Structure

```
Demoody-IP-Messenger/
├── main.js                 # Electron app entry point
├── preload.js              # Secure IPC bridge
├── package.json
├── /network
│   ├── chatService.js      # UDP-based group chat logic
│   ├── fileService.js      # TCP file transfer logic
│   └── peerDiscovery.js    # LAN peer discovery logic
├── /renderer
│   ├── index.html          # Chat UI layout
│   └── index.js            # Frontend chat & file logic
```

---

## 🖥️ Installation & Usage

### 🔧 Requirements

- Node.js (v18 or newer)
- Windows 10 or 11
- Two or more computers on the **same Wi-Fi or LAN**

### 📦 Setup & Run (Development)

```bash
git clone https://github.com/skwasimakram13/demoody-ip-messenger.git
cd demoody-ip-messenger

npm install
npm start
```

### 🏁 Build Windows Executable

```bash
npm run dist
```

The installer `.exe` will be generated inside the `dist/` folder using `electron-builder`.

---

## 📡 How It Works

| Feature         | Protocol | Port  | Purpose                            |
|----------------|----------|-------|------------------------------------|
| Peer Discovery | UDP      | 41234 | Detects other devices              |
| Group Chat     | UDP      | 5000  | Broadcasts chat messages           |
| File Transfer  | TCP      | 6000  | Transfers files directly to peers  |

- Everything works **locally over LAN**.
- No external servers, no internet dependency.
- Temporary files are stored in a secure system path and deleted on exit.

---

## 🛑 Limitations

- Devices must be connected to the **same Wi-Fi network**
- Messages are not saved once the app is closed
- Windows Firewall might prompt for network access on first run

---

## 📦 Packaging Notes

Make sure `electron` is in `devDependencies`:

```json
"devDependencies": {
  "electron": "^37.1.0",
  "electron-builder": "^24.6.0"
}
```

Run:

```bash
npm run dist
```

---

## 🔐 Security & Privacy

- No internet is used at all
- All communication is direct between local devices
- Files are deleted automatically on exit
- No third-party servers or cloud used

---

## 🛠️ Tech Stack

- **Electron** (Node.js + Chromium)
- **UDP (`dgram`)** for group chat & peer discovery
- **TCP (`net`)** for file transfers
- Native Node APIs for filesystem and OS interaction

---

## 🔮 Planned Features

- [x] Peer list UI
- [ ] Push notifications
- [ ] Encrypted messaging
- [ ] Linux/macOS support
- [ ] Android companion app
- [ ] Emoji and file previews

---

## 📜 License

MIT License © 2025 [Demoody](https://github.com/skwasimakram13)

---

## Badges
[![trophy](https://github-profile-trophy.vercel.app/?username=ryo-ma)](https://github.com/ryo-ma/github-profile-trophy)

---

## Author
**Develope By** - [Sk Wasim Akram](https://github.com/skwasimakram13)

- 👨‍💻 All of my projects are available at [https://skwasimakram.com](https://skwasimakram.com)

- 📝 I regularly write articles on [https://blog.skwasimakram.com](https://blog.skwasimakram.com)

- 📫 How to reach me **hello@skwasimakram.com**

- 🧑‍💻 Google Developer Profile [https://g.dev/skwasimakram](https://g.dev/skwasimakram)

- 📲 LinkedIn [https://www.linkedin.com/in/sk-wasim-akram](https://www.linkedin.com/in/sk-wasim-akram)

---

## 🤝 Contribution

Pull requests, feature suggestions, and bug reports are welcome.
