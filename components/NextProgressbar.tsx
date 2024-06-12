"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function Progressbar() {
  return (
    <ProgressBar
      height="3px"
      color="hsl(var(--primary))"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
