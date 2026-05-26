import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AudioCall from "@/components/AudioCall";
import VideoCall from "@/components/VideoCall";
import RoomHeader from "@/components/room/room-header";
import ErrorBanner from "@/components/room/error-banner";
import { useRoom } from "@/hooks/useRoom";

export default function RoomPage() {
    const navigate = useNavigate();
    const { roomName: roomParam } = useParams();
    const [searchParams] = useSearchParams();

    const username = searchParams.get("username") || "";
    const roomName = useMemo(
        () => decodeURIComponent(roomParam || ""),
        [roomParam]
    );

    const {
        isConnected,
        isConnecting,
        participants,
        messages,
        isMicOn,
        isCamOn,
        error,
        connect,
        disconnect,
        sendMessage,
        toggleMic,
        toggleCam,
    } = useRoom();

    useEffect(() => {
        if (!username || !roomName) {
            navigate("/");
            return;
        }
        connect(roomName, username);
        return () => { disconnect(); };
    }, [username, roomName]);

    const handleLeave = () => {
        disconnect();
        navigate("/");
    };

    if (!username || !roomName) return null;

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
            <RoomHeader username={username} roomName={roomName} onLeave={handleLeave} />
            <ErrorBanner message={error} />

            <main className="flex flex-1 overflow-hidden">
                <VideoCall
                    participants={participants}
                    isMicOn={isMicOn}
                    isCamOn={isCamOn}
                    toggleMic={toggleMic}
                    toggleCam={toggleCam}
                    isConnected={isConnected}
                    isConnecting={isConnecting}
                    messages={messages}
                    sendMessage={sendMessage}
                    currentUser={username}
                    onLeave={handleLeave}
                />
            </main>
        </div>
    );
}