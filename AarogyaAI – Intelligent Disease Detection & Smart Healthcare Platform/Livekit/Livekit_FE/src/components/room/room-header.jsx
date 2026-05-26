import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Users, Copy, Check, LogOut } from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function RoomHeader({
    roomName,
    username,
    participantsCount,
    onLeave,
    inviteButton,
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const url = `${window.location.origin}/?room=${encodeURIComponent(roomName)}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Avatar color from username
    const COLORS = [
        "bg-violet-600", "bg-blue-600", "bg-emerald-600",
        "bg-rose-600", "bg-amber-600", "bg-cyan-600",
    ];
    const avatarBg = COLORS[(username?.charCodeAt(0) ?? 0) % COLORS.length];

    return (
        <header className="sticky top-0 z-20 border-b bg-background backdrop-blur-md">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">

                {/* ── Left: room identity ── */}
                <div className="flex min-w-0 items-center gap-3">
                    {/* Live indicator dot */}
                    <div className="relative flex shrink-0 items-center justify-center">
                        <span className="absolute h-3.5 w-3.5 animate-ping rounded-full bg-green-500/40" />
                        <span className="relative h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
                    </div>

                    {/* Room name */}
                    <h1 className="truncate text-sm font-semibold sm:text-base">
                        {roomName}
                    </h1>

                    {/* Participant count pill */}
                    <div className="hidden text-muted-foreground items-center gap-1.5 rounded-full border bg-muted/30 px-2.5 py-1 sm:flex">
                        <Users className="h-3 w-3" />
                        <span className="text-[11px] font-medium tabular-nums">
                            {participantsCount}
                        </span>
                    </div>
                </div>

                {/* ── Right: actions ── */}
                <div className="flex shrink-0 items-center gap-1.5">

                    {/* Username chip */}
                    <div className="hidden items-center gap-2 rounded-full border  bg-white/5 py-1 pl-1 pr-3 md:flex">
                        <div className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ",
                            avatarBg
                        )}>
                            {(username || "?")[0].toUpperCase()}
                        </div>
                        <span className="max-w-[120px] truncate text-xs text-muted-foreground">
                            {username}
                        </span>
                    </div>

                    {/* Invite / copy link */}
                    {inviteButton ?? (
                        <Button
                            onClick={handleCopy}
                            title="Copy invite link"
                            variant={copied ? "default" : "outline"}
                            className={cn(
                                "flex h-8 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-all active:scale-95",
                            )}
                        >
                            {copied
                                ? <><Check className="h-3.5 w-3.5" /> Copied</>
                                : <><Copy className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Invite</span></>
                            }
                        </Button>
                    )}

                    {/* Mode toggle */}
                    <div className="flex h-8 w-8 items-center justify-center">
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}