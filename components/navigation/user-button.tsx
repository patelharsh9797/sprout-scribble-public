"use client";
import { LogIn, LogOut, LogOutIcon } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { signOut, signIn } from "next-auth/react";

type UserButtonProps = {
  session: Session | null;
};

const UserButton = ({ session }: UserButtonProps) => {
  return (
    <>
      {!session ? (
        <li>
          <Button onClick={() => signIn()} className="space-x-1">
            <span>LogIn</span>
            <LogIn size={16} />
          </Button>
        </li>
      ) : (
        <>
          <li>{session.user?.name}</li>
          <li>
            <Button onClick={() => signOut()} className="space-x-1">
              <span>Logout</span>
              <LogOut size={16} />
            </Button>
          </li>
        </>
      )}
    </>
  );
};

export default UserButton;
