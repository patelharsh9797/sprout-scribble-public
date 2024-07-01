import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-56 w-full flex-col items-center justify-center gap-4 text-lg">
      <h2>404 | Not Found</h2>
      <Link className={buttonVariants()} href="/">
        Return <HomeIcon size={18} className="ml-2" />
      </Link>
    </div>
  );
}
