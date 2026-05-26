import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div className="mx-auto mt-4 w-full max-w-7xl px-4">
      <Alert variant="destructive">
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}