import { Camera, CameraOff, MessageSquare, Mic, MicOff, Phone, Users, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CtrlBtn({ onClick, disabled, icon, label, danger, size = "default" }) {
    const isLg = size === "lg";
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={label}
            className="group flex flex-col items-center gap-1 transition-all duration-150 active:scale-95 disabled:opacity-40"
        >
            <div className={cn(
                "flex items-center justify-center rounded-full transition-colors",
                isLg ? "h-14 w-14" : "h-11 w-11",
                danger
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/80"
                    : "bg-muted text-foreground hover:bg-muted/70"
            )}>
                {icon}
            </div>
            <span className="text-[10px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                {label}
            </span>
        </button>
    );
}

export function MobileBottomDock({ mobileTab, setMobileTab, isMicOn, isCamOn, toggleMic, toggleCam, isConnected, onLeave }) {
    const tabs = [
        { id: "video", icon: Video, label: "Video" },
        { id: "chat", icon: MessageSquare, label: "Chat" },
        { id: "participants", icon: Users, label: "People" },
    ];

    return (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur-md">
            {/* Media controls row — only shown on video tab */}
            {mobileTab === "video" && (
                <div className="flex items-center justify-center gap-5 border-b px-4 py-2">
                    <CtrlBtn
                        onClick={toggleMic}
                        disabled={!isConnected}
                        icon={isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                        label={isMicOn ? "Mute" : "Unmute"}
                        danger={!isMicOn}
                    />
                    <CtrlBtn
                        onClick={toggleCam}
                        disabled={!isConnected}
                        icon={isCamOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                        label={isCamOn ? "Stop" : "Start"}
                        danger={!isCamOn}
                    />
                    {onLeave && (
                        <CtrlBtn
                            onClick={onLeave}
                            icon={<Phone className="h-5 w-5 rotate-[135deg]" />}
                            label="Leave"
                            danger
                        />
                    )}
                </div>
            )}

            {/* Tab switcher row */}
            <nav className="grid grid-cols-3">
                {tabs.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setMobileTab(id)}
                        className={cn(
                            "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                            mobileTab === id ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        <span className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-xl transition-colors",
                            mobileTab === id && "bg-primary/10"
                        )}>
                            <Icon className="h-4 w-4" />
                        </span>
                        {label}
                    </button>
                ))}
            </nav>
        </div>
    );
}