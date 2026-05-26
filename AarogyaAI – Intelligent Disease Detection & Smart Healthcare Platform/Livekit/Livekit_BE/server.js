require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { AccessToken } = require("livekit-server-sdk");

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:3001",
  ]
}));
app.use(express.json());

const API_KEY    = process.env.LIVEKIT_API_KEY    || "devkey";
const API_SECRET = process.env.LIVEKIT_API_SECRET || "devsecret";
const PORT       = process.env.PORT               || 3001;

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "LiveKit token server running" });
});

// Generate a signed JWT for a participant to join a room
app.get("/token", async (req, res) => {
  const { room, username } = req.query;

  if (!room || !username) {
    return res
      .status(400)
      .json({ error: "room and username query params are required" });
  }

  try {
    const token = new AccessToken(API_KEY, API_SECRET, {
      identity: username,
      name: username,
      ttl: "6h",
    });

    token.addGrant({
      roomJoin:       true,
      room,
      canPublish:     true,
      canSubscribe:   true,
      canPublishData: true,  // required for chat (data channel)
    });

    const jwt = await token.toJwt();
    res.json({ token: jwt, room, username });
  } catch (err) {
    console.error("Token generation error:", err);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Token server → http://localhost:${PORT}`);
  console.log(`   API Key : ${API_KEY}`);
  console.log(`   LK URL  : ${process.env.LIVEKIT_URL || "ws://localhost:7880"}`);
});