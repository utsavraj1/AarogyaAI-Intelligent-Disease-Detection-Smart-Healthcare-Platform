import { useEffect, useRef } from "react";
import { Track } from "livekit-client";
import { MicOff, Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-rose-500",   "bg-amber-500", "bg-cyan-500",
];

export const avatarColor = (name = "") =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

function VideoTile({ participant, isLocal, isSpotlit, onClick, compact = false, fill = false }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const hasCam = Array.from(participant.videoTrackPublications.values()).some(
    (p) => p.source === Track.Source.Camera && p.track
  );
  const hasMic = Array.from(participant.audioTrackPublications.values()).some(
    (p) => p.source === Track.Source.Microphone && p.track
  );

  useEffect(() => {
    const pub = Array.from(participant.videoTrackPublications.values()).find(
      (p) => p.source === Track.Source.Camera && p.track
    );
    if (pub?.track && videoRef.current) pub.track.attach(videoRef.current);
    return () => { if (pub?.track && videoRef.current) pub.track.detach(videoRef.current); };
  }, [participant, hasCam]);

  useEffect(() => {
    const pub = Array.from(participant.audioTrackPublications.values()).find(
      (p) => p.source === Track.Source.Microphone && p.track
    );
    if (pub?.track && audioRef.current) pub.track.attach(audioRef.current);
    return () => { if (pub?.track && audioRef.current) pub.track.detach(audioRef.current); };
  }, [participant, hasMic]);

  const initials = (participant.identity || "?").slice(0, 2).toUpperCase();
  const color    = avatarColor(participant.identity);

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden bg-muted select-none transition-all duration-200",
        fill ? "absolute inset-0" : "rounded-2xl",
        !fill && (isSpotlit
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : "ring-1 ring-border/60"),
        !fill && onClick && "cursor-pointer hover:ring-2 hover:ring-primary/40",
        !fill && "h-full w-full"
      )}
    >
      {/* Video / Avatar */}
      {hasCam ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="h-full w-full object-cover"
          style={{ transform: isLocal ? "scaleX(-1)" : undefined }}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2.5 bg-muted">
          <div className={cn(
            "flex items-center justify-center rounded-full font-semibold text-white shadow-md",
            color,
            compact ? "h-10 w-10 text-sm" : fill ? "h-24 w-24 text-3xl" : "h-16 w-16 text-xl"
          )}>
            {initials}
          </div>
          {!compact && <span className="text-xs text-muted-foreground">Camera off</span>}
        </div>
      )}

      {!isLocal && <audio ref={audioRef} autoPlay playsInline />}

      {/* Name + mic overlay */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 via-black/15 to-transparent px-3 pb-2.5 pt-8">
        <span className={cn(
          "font-medium text-white drop-shadow-sm",
          compact ? "text-[10px]" : "text-xs"
        )}>
          {participant.identity}{isLocal ? " (you)" : ""}
        </span>
        {!hasMic && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive shadow-sm">
            <MicOff className="h-3 w-3 text-destructive-foreground" />
          </div>
        )}
      </div>

      {/* Pin hint */}
      {onClick && !compact && !fill && (
        <div className="absolute right-2.5 top-2.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm">
            {isSpotlit
              ? <PinOff className="h-3.5 w-3.5 text-white" />
              : <Pin    className="h-3.5 w-3.5 text-white" />}
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoTile;