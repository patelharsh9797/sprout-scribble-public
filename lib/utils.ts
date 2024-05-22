import { env } from "@/env.mjs";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getBaseURL() {
  if (typeof window !== "undefined") return "";
  if (process.env.NODE_ENV === "production") return env.BASE_URL;
  return "http://localhost:3000";
}
