import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { avatarColor } from "@/components/video/video-tile";

const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const LONG_LIMIT = 260;

function ChatBubble({ message, prevMessage, nextMessage, currentUser }) {
  const [expanded, setExpanded] = useState(false);
  const [copied,   setCopied]   = useState(false);

  const isLocal =
    typeof message.isLocal === "boolean"
      ? message.isLocal
      : message.sender === currentUser;

  const isGroupedWithPrev =
    prevMessage &&
    prevMessage.sender === message.sender &&
    (typeof prevMessage.isLocal === "boolean" ? prevMessage.isLocal : prevMessage.sender === currentUser) === isLocal &&
    new Date(message.timestamp) - new Date(prevMessage.timestamp) < 60_000;

  const isGroupedWithNext =
    nextMessage &&
    nextMessage.sender === message.sender &&
    (typeof nextMessage.isLocal === "boolean" ? nextMessage.isLocal : nextMessage.sender === currentUser) === isLocal &&
    new Date(nextMessage.timestamp) - new Date(message.timestamp) < 60_000;

  const text          = message.text || "";
  const shouldCollapse = text.length > LONG_LIMIT || text.includes("\n");
  const displayText   = useMemo(() => {
    if (!shouldCollapse || expanded) return text;
    return text.slice(0, LONG_LIMIT).trimEnd() + "…";
  }, [text, shouldCollapse, expanded]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  };

  const color = avatarColor(message.sender);

  return (
    <div className={cn(
      "flex w-full gap-2",
      isLocal ? "justify-end" : "justify-start",
      isGroupedWithPrev ? "mt-0.5" : "mt-4"
    )}>
      {/* Remote avatar column */}
      {!isLocal && (
        <div className="w-7 shrink-0 self-end">
          {!isGroupedWithPrev ? (
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white",
              color
            )}>
              {(message.sender || "?")[0].toUpperCase()}
            </div>
          ) : <div className="h-7 w-7" />}
        </div>
      )}

      {/* Content */}
      <div className={cn(
        "group flex max-w-[78%] min-w-0 flex-col",
        isLocal ? "items-end" : "items-start"
      )}>
        {/* Sender name */}
        {!isLocal && !isGroupedWithPrev && (
          <span className="mb-1 px-0.5 text-[11px] font-semibold text-muted-foreground">
            {message.sender}
          </span>
        )}

        <div className={cn("flex items-end gap-1 min-w-0", isLocal ? "flex-row-reverse" : "flex-row")}>
          {/* Bubble */}
          <div className={cn(
            "rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm min-w-0 overflow-hidden",
            isLocal
              ? "bg-primary text-primary-foreground"
              : "border bg-card text-foreground",
            // Grouped shape refinement
            isLocal  && isGroupedWithPrev && "rounded-tr-md",
            isLocal  && isGroupedWithNext && "rounded-br-md",
            !isLocal && isGroupedWithPrev && "rounded-tl-md",
            !isLocal && isGroupedWithNext && "rounded-bl-md",
          )}>
            <p className="whitespace-pre-wrap break-words">{displayText}</p>
            {shouldCollapse && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className={cn(
                  "mt-1.5 text-[11px] font-medium underline-offset-2 hover:underline",
                  isLocal ? "text-primary-foreground/70" : "text-muted-foreground"
                )}
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Copy btn — hover on desktop, always on mobile */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className={cn(
              "h-6 w-6 shrink-0 rounded-md transition-opacity md:opacity-0 md:group-hover:opacity-100",
              isLocal ? "text-muted-foreground" : "text-muted-foreground"
            )}
          >
            {copied
              ? <Check className="h-3 w-3 text-primary" />
              : <Copy  className="h-3 w-3" />}
          </Button>
        </div>

        {/* Timestamp — end of group only */}
        {!isGroupedWithNext && (
          <span className="mt-1 px-0.5 text-[10px] text-muted-foreground/60">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}

export default ChatBubble;