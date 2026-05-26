import { useEffect, useRef, useState } from "react";
import { SendHorizonal, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import ChatBubble from "@/components/chat/chat-bubble";

export default function ChatBox({ messages, sendMessage, currentUser }) {
  const [input, setInput]   = useState("");
  const bottomRef           = useRef(null);
  const textareaRef         = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const value = input.trim();
    if (!value) return;
    sendMessage(value);
    setInput("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex min-h-full flex-col px-3 py-4">
          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-12">
              <div className="flex max-w-xs flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-muted">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Be the first to say something
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {messages.map((msg, i) => (
                <ChatBubble
                  key={msg.id ?? `${msg.sender}-${msg.timestamp}-${i}`}
                  message={msg}
                  prevMessage={messages[i - 1]}
                  nextMessage={messages[i + 1]}
                  currentUser={currentUser}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Composer */}
      <div className="flex items-end gap-2 border-t bg-card px-3 py-3">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message…"
          className="min-h-16 max-h-62 resize-none border-0 px-2 py-2 text-sm shadow-none focus-visible:ring-0 overflow-y-auto"
        />
        <Button
          type="button"
          size="icon"
          onClick={handleSend}
          disabled={!input.trim()}
          className="h-10 w-10 shrink-0 rounded-xl"
        >
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}