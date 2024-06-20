"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-56 w-full flex-col items-center justify-center gap-4 text-lg">
      <h2>{error.message}</h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        <RefreshCcw size={16} className="mr-2" />
        <span>Try again</span>
      </Button>
    </div>
  );
}
