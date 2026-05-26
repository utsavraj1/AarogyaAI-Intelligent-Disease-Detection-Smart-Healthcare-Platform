# LiveKit – Real-time Communication Module

**Part of AarogyaAI – Intelligent Disease Detection & Smart Healthcare Platform**

A full-featured real-time communication app built with **LiveKit WebRTC** + **React**. Integrated into AarogyaAI for patient-doctor consultations, group calls, and secure messaging.

## 🎯 Features

💬 **Real-time Chat** — Text messaging via LiveKit data channels  
🎙️ **Audio Calls** — Voice communication with mute/unmute toggle  
📹 **Video Calls** — HD video with responsive grid layout  
🔐 **Secure** — End-to-end encrypted WebRTC connections  
🖥️ **Screen Share** — Share medical reports & test results  
📱 **Responsive** — Works on desktop, tablet, mobile  

---

## 📋 Use Cases in AarogyaAI

- 👨‍⚕️ **Doctor Consultations** — Video appointments with specialists
- 👥 **Group Consultations** — Multi-doctor case discussions
- 📄 **Report Discussion** — Screen share lab reports & test results
- 💬 **Follow-up Chat** — Post-consultation messaging
- 📺 **Health Webinars** — Educational sessions for patients

---

## 🏗️ Architecture

```
AarogyaAI/
└── Livekit/                          ← Communication module
    ├── livekit.yaml                  ← LiveKit server config
    ├── docker-compose.yml            ← Self-hosted deployment
    │
    ├── Livekit_BE/                   ← Token Server (Express.js)
    │   ├── server.js                 ← Token generation API
    │   ├── .env                      ← LiveKit credentials
    │   ├── package.json
    │   └── dockerfile
    │
    └── Livekit_FE/                   ← Frontend (React + Vite)
        ├── src/
        │   ├── components/           ← ChatBox, AudioCall, VideoCall
        │   ├── hooks/
        │   │   └── useRoom.js        ← LiveKit WebRTC logic
        │   ├── App.jsx               ← Main UI
        │   └── main.jsx
        ├── vite.config.js
        ├── package.json
        └── dockerfile
```

---

## 🚀 Quick Start

### Option 1: Local Development

#### Backend (Token Server)

```bash
cd Livekit_BE
npm install
npm start
```

Ensure `.env` is configured:
```env
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
LIVEKIT_URL=ws://localhost:7880
PORT=3001
```

#### Frontend

```bash
cd Livekit_FE
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

### Option 2: Docker Deployment

```bash
cd Livekit
docker-compose up --build
```

Access at **http://localhost:3000**

---

## 🔧 Configuration

### LiveKit Server Setup

Download LiveKit binary:
```bash
wget https://releases.livekit.io/livekit-server-linux-x64

# Run with config
./livekit-server --config livekit.yaml
```

Or use **LiveKit Cloud**: https://cloud.livekit.io

### Environment Variables

**Backend (.env)**
```env
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-secret
LIVEKIT_URL=ws://livekit-server:7880
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_TOKEN_SERVER_URL=http://localhost:3001
VITE_LIVEKIT_URL=ws://localhost:7880
```

---

## 📚 Key Components

### useRoom.js
Manages all LiveKit WebRTC logic:
- Room connection
- Track subscription
- Audio/video state
- Data channel messaging

```javascript
const { room, participants, isMuted, isCamera } = useRoom(roomName, userIdentity)
```

### ChatBox.jsx
Real-time messaging component using data channels

### AudioCall.jsx
Audio-only conference with mute/unmute controls

### VideoCall.jsx
Full video conference with grid layout

---

## 🔌 API Endpoints

### Token Generation

```bash
POST /token
Content-Type: application/json

{
  "room": "room-name",
  "username": "user-identity"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Join Room Flow

1. Frontend requests token from backend
2. Backend verifies user & generates JWT token
3. Frontend connects to LiveKit server with token
4. User joins room & streams audio/video

---

## 🐳 Docker Multi-Container

```yaml
services:
  livekit:
    image: livekit/livekit-server:latest
    ports:
      - "7880:7880"
      - "7881:7881"
    volumes:
      - ./livekit.yaml:/etc/livekit.yaml

  backend:
    build: ./Livekit_BE
    ports:
      - "3001:3001"
    depends_on:
      - livekit

  frontend:
    build: ./Livekit_FE
    ports:
      - "3000:80"
    depends_on:
      - backend
```

---

## 🔐 Security Best Practices

✅ **HTTPS/WSS Only** — Use secure WebSocket (wss://)  
✅ **Token Validation** — Verify JWT signature on backend  
✅ **Room Authorization** — Check user permissions before joining  
✅ **Rate Limiting** — Prevent token abuse  
✅ **CORS Policy** — Restrict frontend origins  

---

## 📊 Performance Tips

- Limit participants per room (6-10 recommended)
- Use VP8 codec for bandwidth efficiency
- Enable simulcast for multi-bitrate streaming
- Monitor network conditions with stats collection

---

## 🐛 Troubleshooting

### WebRTC Connection Failed
- Check firewall/NAT settings
- Ensure TURN servers configured
- Verify LiveKit server running

### No Audio/Video
- Check browser camera/microphone permissions
- Verify media device enumeration
- Check WebRTC stats console

### Token Errors
- Verify API key & secret
- Check token expiration (1 hour default)
- Inspect JWT payload

---

## 📖 Resources

- [LiveKit Docs](https://docs.livekit.io/)
- [LiveKit React Components](https://docs.livekit.io/realtime/client/react-components/)
- [WebRTC Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

---

## 📞 Integration with AarogyaAI

For embedding in main AarogyaAI app:

```jsx
import { LiveKitRoom } from '@livekit/components-react'

export function Consultation() {
  const token = await generateLiveKitToken(appointmentId)
  
  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl="ws://livekit-server:7880"
    >
      <VideoConference />
    </LiveKitRoom>
  )
}
```

---

## ⚠️ Medical Compliance

- 🏥 HIPAA-compliant data handling
- 🔐 Encrypted transmission (TLS 1.3)
- 📋 Record consultations with consent
- 🗑️ Auto-purge session recordings after 90 days
- 📊 Audit logging for medical compliance

### 3. Frontend Application
The frontend React app first interacts with your local backend to fetch an access token, and then connects to LiveKit directly using websockets.

```bash
cd Livekit_FE
npm install
npm run dev
```

Ensure your `.env` in `Livekit_FE` is pointing to the local instances:
```env
VITE_LIVEKIT_URL=ws://localhost:7880
VITE_TOKEN_SERVER_URL=http://localhost:3001
```

Once `npm run dev` kicks off, Vite will provide you with a local address in the terminal (usually `http://localhost:5173/` or `http://localhost:5174/`). 
Open that URL, enter your name and a room name, and click **Join Room**.

To test multi-participant features, simply open another browser tab and use the exact same room name to connect a secondary test user!

---

## How it works

| Feature | Mechanism |
|---------|-----------|
| Chat | `room.localParticipant.publishData()` — JSON over LiveKit data channel |
| Audio | `createLocalAudioTrack()` → `publishTrack()` |
| Video | `createLocalVideoTrack()` → `publishTrack()` → `track.attach(videoEl)` |
| Auth | Backend generates a signed JWT using `livekit-server-sdk` |