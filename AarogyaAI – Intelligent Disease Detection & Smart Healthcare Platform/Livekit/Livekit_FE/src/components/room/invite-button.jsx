import { Button } from "@/components/ui/button";

export default function InviteButton({ onClick }) {
  return (
    <Button variant="outline" onClick={onClick}>
      🔗 Invite
    </Button>
  );
}