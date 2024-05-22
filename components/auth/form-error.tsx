import { AlertCircle } from "lucide-react";

export const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="my-4 flex items-center gap-2 rounded-md bg-destructive/25 p-3 text-xs font-medium text-secondary-foreground">
      <AlertCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
