import { useState, useEffect, useRef, useCallback } from "react";
import {
  Room,
  RoomEvent,
  createLocalAudioTrack,
  createLocalVideoTrack,
  Track,
  DisconnectReason,
} from "livekit-client";

// When running via Docker: nginx proxies both paths from the same origin.
// When running locally (npm run dev): vite proxy forwards /token to :3001
//   and VITE_LIVEKIT_URL points directly to ws://localhost:7880
const IS_DEV = import.meta.env.DEV;

const LIVEKIT_URL = IS_DEV
  ? (import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880")
  : `ws://${window.location.host}/livekit`;

const TOKEN_SERVER = IS_DEV
  ? (import.meta.env.VITE_TOKEN_SERVER_URL || "http://localhost:3001")
  : "";   // empty = same origin, nginx proxies /token

export function useRoom() {
  const roomRef = useRef(null);
  const [isConnected,  setIsConnected]  = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages,     setMessages]     = useState([]);
  const [isMicOn,      setIsMicOn]      = useState(false);
  const [isCamOn,      setIsCamOn]      = useState(false);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;

    const updateParticipants = () => {
      const remotes = Array.from(room.remoteParticipants.values());
      setParticipants([room.localParticipant, ...remotes]);
    };

    room.on(RoomEvent.ParticipantConnected,    updateParticipants);
    room.on(RoomEvent.ParticipantDisconnected, updateParticipants);
    room.on(RoomEvent.TrackSubscribed,         updateParticipants);
    room.on(RoomEvent.TrackUnsubscribed,       updateParticipants);
    room.on(RoomEvent.LocalTrackPublished,     updateParticipants);
    room.on(RoomEvent.LocalTrackUnpublished,   updateParticipants);

    // Chat via LiveKit data channel
    room.on(RoomEvent.DataReceived, (payload, participant) => {
      try {
        const msg = JSON.parse(new TextDecoder().decode(payload));
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            text: msg.text,
            sender: participant?.identity || "Unknown",
            timestamp: msg.timestamp || Date.now(),
            isLocal: false,
          },
        ]);
      } catch { /* non-JSON, ignore */ }
    });

    room.on(RoomEvent.Connected, () => {
      setIsConnected(true);
      setIsConnecting(false);
      updateParticipants();
    });

    room.on(RoomEvent.Disconnected, (reason) => {
      setIsConnected(false);
      setIsMicOn(false);
      setIsCamOn(false);
      setParticipants([]);
      if (reason !== DisconnectReason.CLIENT_INITIATED) {
        setError("Disconnected from room. Please rejoin.");
      }
    });

    room.on(RoomEvent.ConnectionStateChanged, (state) => {
      if (state === "reconnecting") setError("Reconnecting…");
      if (state === "connected")    setError(null);
    });

    return () => {
      room.removeAllListeners();
      room.disconnect();
    };
  }, []);

  const connect = useCallback(async (roomName, username) => {
    setIsConnecting(true);
    setError(null);
    try {
      const url = `${TOKEN_SERVER}/token?room=${encodeURIComponent(roomName)}&username=${encodeURIComponent(username)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
      const { token } = await res.json();
      await roomRef.current.connect(LIVEKIT_URL, token);
    } catch (err) {
      setError(err.message || "Connection failed");
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    roomRef.current?.disconnect();
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (text) => {
    const room = roomRef.current;
    if (!room || !text.trim()) return;
    const payload = JSON.stringify({ text, timestamp: Date.now() });
    await room.localParticipant.publishData(
      new TextEncoder().encode(payload),
      { reliable: true }
    );
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        sender: room.localParticipant.identity,
        timestamp: Date.now(),
        isLocal: true,
      },
    ]);
  }, []);

  const toggleMic = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    try {
      if (isMicOn) {
        room.localParticipant.audioTrackPublications.forEach((pub) => {
          pub.track?.stop();
          room.localParticipant.unpublishTrack(pub.track);
        });
        setIsMicOn(false);
      } else {
        const track = await createLocalAudioTrack({
          echoCancellation: true,
          noiseSuppression: true,
        });
        await room.localParticipant.publishTrack(track);
        setIsMicOn(true);
      }
    } catch (err) {
      setError("Microphone error: " + err.message);
    }
  }, [isMicOn]);

  const toggleCam = useCallback(async (videoRef) => {
    const room = roomRef.current;
    if (!room) return;
    try {
      if (isCamOn) {
        room.localParticipant.videoTrackPublications.forEach((pub) => {
          if (pub.source === Track.Source.Camera) {
            pub.track?.stop();
            room.localParticipant.unpublishTrack(pub.track);
          }
        });
        setIsCamOn(false);
      } else {
        const track = await createLocalVideoTrack({ facingMode: "user" });
        await room.localParticipant.publishTrack(track);
        if (videoRef?.current) track.attach(videoRef.current);
        setIsCamOn(true);
      }
    } catch (err) {
      setError("Camera error: " + err.message);
    }
  }, [isCamOn]);

  return {
    room: roomRef.current,
    isConnected, isConnecting, participants,
    messages, isMicOn, isCamOn, error,
    connect, disconnect, sendMessage, toggleMic, toggleCam,
  };
}