import { Mic, MicOff, Camera, CameraOff, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


function ControlBtn({ onClick, disabled, icon, label, danger, className }) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            variant={danger ? "destructive" : "outline"}
            title={label}
            className={cn("h-10 w-10 rounded-xl", className)}
        >
            {icon}
        </Button>
    );
}

const FloatingPill = ({
    toggleMic,
    isConnected,
    isMicOn,
    toggleCam,
    isCamOn,
    setSheetOpen,
    onLeave,
}) => {
    return (
        <div className="flex shrink-0 items-center justify-center py-3">
            <div className="flex items-center gap-1.5 rounded-2xl bg-card/95 px-3 py-2 shadow-xl ring-1 ring-border backdrop-blur-md">
                <ControlBtn
                    onClick={toggleMic}
                    disabled={!isConnected}
                    icon={isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    label={isMicOn ? "Mute" : "Unmute"}
                    danger={!isMicOn}
                />
                <ControlBtn
                    onClick={toggleCam}
                    disabled={!isConnected}
                    icon={isCamOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                    label={isCamOn ? "Stop video" : "Start video"}
                    danger={!isCamOn}
                />
                <ControlBtn
                    onClick={() => setSheetOpen(true)}
                    icon={<MessageCircle />}
                    variant="ghost"
                    label={"Chat & People"}
                    className="hidden sm:flex lg:hidden"
                />

                <div className="mx-1 h-5 w-px bg-border" />
                {onLeave && (
                    <Button
                        onClick={onLeave}
                        className="flex h-9 items-center gap-1.5 rounded-xl bg-destructive/90 px-3.5 text-xs font-medium text-destructive-foreground transition-all hover:bg-destructive active:scale-95"
                    >
                        <Phone className="h-3.5 w-3.5 rotate-[135deg]" />
                        Leave
                    </Button>
                )}
            </div>
        </div>
    );
};

export default FloatingPill;