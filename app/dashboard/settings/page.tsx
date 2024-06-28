import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import SettingsCard from "./settings-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Settings() {
  const session = await auth();

  if (!session) redirect("/");
  if (session) return <SettingsCard session={session} />;
}
