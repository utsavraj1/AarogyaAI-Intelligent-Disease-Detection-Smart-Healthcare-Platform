import { Camera, CameraOff, Copy, LogOut, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef } from "react";

const ActionController = ({
    isMicOn,
    isCamOn,
    toggleMic,
    toggleCam,
    isConnected,
    className,
}) => {
    const localVideoRef = useRef(null);

    return (
        <div className={cn("flex gap-4 justify-between border-t bg-muted/20 p-3", className)}>
            <Button size="icon" variant="outline" className="rounded-lg">
                <Copy className="h-4 w-4" />
            </Button>
            <div className="flex gap-2 items-center">

                <Button
                    size="icon"
                    variant={isMicOn ? "destructive" : "default"}
                    onClick={toggleMic}
                    disabled={!isConnected}
                    title={isMicOn ? "Mute mic" : "Unmute mic"}
                    className="rounded-lg"
                >
                    {isMicOn ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <Button
                    size="icon"
                    variant={isCamOn ? "default" : "destructive"}
                    onClick={() => toggleCam(localVideoRef)}
                    disabled={!isConnected}
                    title={isCamOn ? "Stop camera" : "Start camera"}
                    className="rounded-lg"
                >
                    {isCamOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                </Button>
            </div>

            <Button size="icon" variant="destructive" className="rounded-lg">
                <LogOut className="h-4 w-4" />
            </Button>


        </div>
    )
}

export default ActionController