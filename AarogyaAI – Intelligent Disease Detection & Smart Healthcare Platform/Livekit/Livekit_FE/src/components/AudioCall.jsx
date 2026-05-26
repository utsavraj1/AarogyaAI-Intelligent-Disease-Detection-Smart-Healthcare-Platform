import { useEffect, useRef } from "react";
import { Track } from "livekit-client";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function RemoteAudio({ participant }) {
  const audioRef = useRef(null);

  const hasMic = Array.from(participant.audioTrackPublications.values()).some(
    (p) => p.source === Track.Source.Microphone && p.track
  );

  useEffect(() => {
    const pub = Array.from(participant.audioTrackPublications.values()).find(
      (p) => p.source === Track.Source.Microphone && p.track
    );
    if (pub?.track && audioRef.current) {
      pub.track.attach(audioRef.current);
    }
    return () => {
      if (pub?.track && audioRef.current) pub.track.detach(audioRef.current);
    };
  }, [participant, hasMic]);

  return <audio ref={audioRef} autoPlay playsInline />;
}

export default function AudioCall({
  participants,
  isMicOn,
  toggleMic,
  isConnected,
}) {
  const remotes = participants.filter((p) => !p.isLocal);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b px-4 py-3">
        <Badge
          variant="secondary"
          className="flex w-fit items-center gap-2 rounded-md px-3 py-1"
        >
          <Mic className="h-4 w-4" />
          <span>Audio Call</span>
          <span className="text-muted-foreground">
            {participants.length} participant{participants.length !== 1 ? "s" : ""}
          </span>
        </Badge>
      </div>

      {remotes.map((p) => (
        <RemoteAudio key={p.sid} participant={p} />
      ))}

      <div className="flex flex-1 flex-wrap gap-4 p-4">
        {participants.map((p) => {
          const hasMic = Array.from(p.audioTrackPublications.values()).some(
            (pub) =>
              pub.source === Track.Source.Microphone &&
              pub.track &&
              !pub.isMuted
          );

          return (
            <div
              key={p.sid}
              className="flex min-w-24 flex-col items-center gap-2 rounded-xl border bg-background/50 px-4 py-4"
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-lg font-bold text-foreground transition-all ${hasMic
                    ? "border-green-500 bg-background shadow-[0_0_12px_rgba(34,197,94,0.25)]"
                    : "border-muted-foreground/30 bg-background"
                  }`}
              >
                {p.identity?.[0]?.toUpperCase() || "?"}
              </div>

              <div className="text-center text-sm font-medium text-foreground">
                {p.identity} {p.isLocal ? "(you)" : ""}
              </div>

              <div className="text-center text-xs text-muted-foreground">
                {
                  hasMic ?
                    <div className="flex gap-1.5 items-center">
                      <Mic size={14} /> Speaking
                    </div>
                    :
                    <div className="flex gap-1.5 items-center">
                      <MicOff size={14} /> Muted
                    </div>
                }
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2 border-t border-border bg-muted/20 p-4">
        <Button
          onClick={toggleMic}
          disabled={!isConnected}
          variant={isMicOn ? "destructive" : "default"}
          className="min-w-36 rounded-lg"
        >
          {isMicOn ? (
            <>
              <MicOff className="mr-2 h-4 w-4" />
              Mute
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Unmute
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          {isMicOn
            ? "You are live — others can hear you"
            : "Microphone is muted"}
        </div>
      </div>
    </div>
  );
}