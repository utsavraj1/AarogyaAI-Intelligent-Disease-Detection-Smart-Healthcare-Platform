import { Track } from "livekit-client";
import { Mic, MicOff, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

function ParticipantsList({ participants }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-muted">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">People</p>
              <p className="text-xs text-muted-foreground">
                {participants.length} in this room
              </p>
            </div>
          </div>

          <Badge variant="secondary" className="rounded-full">
            {participants.length}
          </Badge>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-2 p-3">
          {participants.map((p) => {
            const hasMic = Array.from(p.audioTrackPublications.values()).some(
              (pub) => pub.source === Track.Source.Microphone && pub.track
            );

            return (
              <div
                key={p.sid}
                className="flex items-center gap-3 rounded-xl border bg-card px-3 py-3 transition-colors hover:bg-muted/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-semibold text-foreground">
                  {(p.identity || "?").slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {p.identity}
                    </p>

                    {p.isLocal ? (
                      <Badge variant="outline" className="h-5 rounded-full px-2 text-[10px]">
                        You
                      </Badge>
                    ) : null}
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {hasMic ? "Microphone on" : "Muted"}
                  </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-muted">
                  {hasMic ? (
                    <Mic className="h-4 w-4 text-foreground" />
                  ) : (
                    <MicOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default ParticipantsList;