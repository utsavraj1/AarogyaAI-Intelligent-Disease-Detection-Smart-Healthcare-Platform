import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function JoinPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");

  // Pre-fill room name from ?room= URL param (invite link support)
  useEffect(() => {
    const room = searchParams.get("room");
    if (room) setRoomName(room);
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedRoomName = roomName.trim();

    if (!trimmedUsername || !trimmedRoomName) {
      toast.error("Please enter both username and room name.");
      return;
    }

    navigate(
      `/room/${encodeURIComponent(trimmedRoomName)}?username=${encodeURIComponent(trimmedUsername)}`
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Live Chat
            </CardTitle>
            <CardDescription>
              Real-time chat, audio &amp; video — powered by LiveKit
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Your name</Label>
                <Input
                  id="username"
                  placeholder="e.g. Alice"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomName">Room name</Label>
                <Input
                  id="roomName"
                  placeholder="e.g. dev-standup"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Join Room
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}