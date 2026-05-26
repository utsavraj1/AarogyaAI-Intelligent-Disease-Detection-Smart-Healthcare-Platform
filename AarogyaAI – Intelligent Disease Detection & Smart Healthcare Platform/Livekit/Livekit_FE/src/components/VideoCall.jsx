import { useEffect, useState, useCallback } from "react";
import {
  Mic, MicOff, Camera, CameraOff, Phone,
  MessageSquare, Users, Video,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/ChatBox";
import VideoPane from "@/components/video/video-pane";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import ParticipantsList from "./video/participants-list";
import SidePanel from "./room/side-panel";
import { CtrlBtn, MobileBottomDock } from "./room/bottom-mobile-dock";




// ─── Control Button — Meet-style (circle icon + label) ────────────────────────



// ─── Desktop control bar ───────────────────────────────────────────────────────

function DesktopControlBar({ isMicOn, isCamOn, toggleMic, toggleCam, isConnected, onLeave, onChatOpen }) {
  return (
    <div className="flex shrink-0 items-end justify-center gap-4 border-t bg-muted/50 px-4 py-3">
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
        label={isCamOn ? "Stop video" : "Start video"}
        danger={!isCamOn}
      />
      {onChatOpen && (
        <CtrlBtn
          onClick={onChatOpen}
          icon={<MessageSquare className="h-5 w-5" />}
          label="Chat"
        />
      )}
      {onLeave && (
        <CtrlBtn
          onClick={onLeave}
          icon={<Phone className="h-5 w-5 rotate-[135deg]" />}
          label="Leave"
          danger
        />
      )}
    </div>
  );
}


// ─── VideoCall ────────────────────────────────────────────────────────────────

export default function VideoCall({
  participants,
  isMicOn,
  isCamOn,
  toggleMic,
  toggleCam,
  isConnected,
  isConnecting,
  messages = [],
  sendMessage,
  currentUser,
  onLeave,
}) {
  const [spotlitId, setSpotlitId] = useState(null);
  const [sideTab, setSideTab] = useState("chat");
  const [sideOpen, setSideOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("video");

  const local = participants.find((p) => p.isLocal);
  const remotes = participants.filter((p) => !p.isLocal);
  const all = [...(local ? [local] : []), ...remotes];
  const spotlit = spotlitId ? all.find((p) => p.sid === spotlitId || p.identity === spotlitId) : null;
  const thumbs = spotlit ? all.filter((p) => p !== spotlit) : [];

  const handleTileClick = useCallback((p) => {
    setSpotlitId((prev) =>
      prev === p.sid || prev === p.identity ? null : (p.sid || p.identity)
    );
  }, []);

  useEffect(() => {
    if (participants.length === 2 && !spotlitId) {
      const remote = participants.find((p) => !p.isLocal);
      if (remote) setSpotlitId(remote.sid || remote.identity);
    }
  }, [participants.length]);

  const gridCols = (n) => {
    if (n === 1) return "grid-cols-1";

    return cn(
      "grid-cols-1",
      "sm:grid-cols-2",
      "lg:grid-cols-3",
      "2xl:grid-cols-4"
    );
  };

  // Dock height estimate for bottom padding:
  // video tab: controls (~76px) + tabs (~56px) = ~132px
  // other tabs: just tabs (~56px)
  const mobilePaddingBottom = mobileTab === "video" ? "pb-[144px]" : "pb-[68px]";

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden border">
      {/* ════════════════════════════════════════════
          MOBILE  (< sm)
          - True page scroll (overflow-y-auto on the outer wrapper)
          - Video pane + tiles all in the natural document flow
          - Fixed bottom dock
      ════════════════════════════════════════════ */}
      <div className="flex flex-1 flex-col overflow-hidden sm:hidden">
        {/* Scrollable page */}
        <div className={cn("flex-1 overflow-y-auto", mobilePaddingBottom)}>
          {mobileTab === "video" && (
            <div className="p-2">
              <VideoPane
                spotlit={spotlit}
                thumbnails={thumbs}
                all={all}
                handleTileClick={handleTileClick}
                gridCols={gridCols}
                isMobile
              />
            </div>
          )}
          {mobileTab === "chat" && (
            /* Chat needs its own full-height container, not page scroll */
            (<div className="flex h-full flex-col">
              <ChatBox messages={messages} sendMessage={sendMessage} currentUser={currentUser} />
            </div>)
          )}
          {mobileTab === "participants" && (
            <ParticipantsList participants={participants} />
          )}
        </div>

        {/* Fixed dock */}
        <MobileBottomDock
          mobileTab={mobileTab}
          setMobileTab={setMobileTab}
          isMicOn={isMicOn}
          isCamOn={isCamOn}
          toggleMic={toggleMic}
          toggleCam={toggleCam}
          isConnected={isConnected}
          onLeave={onLeave}
        />
      </div>
      {/* ════════════════════════════════════════════
          TABLET  (sm → lg)
      ════════════════════════════════════════════ */}
      <div className="hidden flex-1 flex-col overflow-hidden sm:flex lg:hidden">
        <div className="flex flex-1 flex-col overflow-hidden p-3">
          <VideoPane
            spotlit={spotlit}
            thumbnails={thumbs}
            all={all}
            handleTileClick={handleTileClick}
            gridCols={gridCols}
          />
        </div>
        <DesktopControlBar
          isMicOn={isMicOn}
          isCamOn={isCamOn}
          toggleMic={toggleMic}
          toggleCam={toggleCam}
          isConnected={isConnected}
          onLeave={onLeave}
          onChatOpen={() => setSheetOpen(true)}
        />
      </div>
      {/* ════════════════════════════════════════════
          DESKTOP  (lg+)
      ════════════════════════════════════════════ */}
      <div className="hidden flex-1 overflow-hidden lg:flex">

        {/* Video + control bar */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col overflow-hidden p-3">
            <VideoPane
              spotlit={spotlit}
              thumbnails={thumbs}
              all={all}
              handleTileClick={handleTileClick}
              gridCols={gridCols}
            />
          </div>
          <DesktopControlBar
            isMicOn={isMicOn}
            isCamOn={isCamOn}
            toggleMic={toggleMic}
            toggleCam={toggleCam}
            isConnected={isConnected}
            onLeave={onLeave}
          />
        </div>

        {/* Sidebar */}
        <div className="flex w-[300px] shrink-0 flex-col border-l xl:w-[340px]">
          <SidePanel
            tab={sideTab}
            setTab={setSideTab}
            messages={messages}
            sendMessage={sendMessage}
            currentUser={currentUser}
            participants={participants}
            onCollapse={() => setSideOpen(false)}
          />
        </div>
      </div>
      {/* ════════════════════════════════════════════
          TABLET SHEET
      ════════════════════════════════════════════ */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[320px] border-l p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Panel</SheetTitle>
          </SheetHeader>
          <div className="h-full overflow-hidden">
            <SidePanel
              tab={sideTab}
              setTab={setSideTab}
              messages={messages}
              sendMessage={sendMessage}
              currentUser={currentUser}
              participants={participants}
              onClose={() => setSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}