import { MessageSquare, Users } from "lucide-react";
import ChatBox from "@/components/ChatBox";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import ParticipantsList from "../video/participants-list";


function SidePanel({
    tab,
    setTab,
    messages,
    sendMessage,
    currentUser,
    participants
}) {
    return (
        <div className="flex h-full w-full flex-col">

            {/* Tab header row */}
            <Tabs value={tab} onValueChange={setTab} className="w-full h-full">
                <TabsList className="grid w-full grid-cols-2 rounded-none gap-0 z-10" variant="line">
                    <TabsTrigger value="chat" className="border-none gap-1.5 border-b-2 bg-muted data-active:border-primary data-active:border-b-2">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Chat
                    </TabsTrigger>
                    <TabsTrigger value="participants" className="border-none gap-1.5 border-b-2 relative data-active:border-primary data-active:border-b-2 p-2">
                        <Users className="h-3.5 w-3.5" />
                        People
                        <span className="rounded-full px-1.5 py-px text-[9px] font-semibold leading-none ml-1 bg-primary/20 text-primary-foreground">
                            {participants.length}
                        </span>
                    </TabsTrigger>
                </TabsList>

                {/* Content — fills remaining height */}
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <TabsContent value="chat" className="flex-1 overflow-hidden">
                        <ChatBox messages={messages} sendMessage={sendMessage} currentUser={currentUser} />
                    </TabsContent>
                    <TabsContent value="participants" className="flex-1 overflow-hidden">
                        <ParticipantsList participants={participants} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

export default SidePanel;