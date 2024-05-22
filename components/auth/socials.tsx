"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Socials() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Button
        variant={"outline"}
        className="flex w-full gap-4"
        onClick={() =>
          signIn("google", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        <p>Sign in with Google</p>
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        className="flex w-full gap-4"
        variant={"outline"}
        onClick={() =>
          signIn("github", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        Sign in with Github
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
}
