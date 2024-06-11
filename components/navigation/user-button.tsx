"use client";
import { LogIn, LogOut, Settings, TruckIcon } from "lucide-react";
import { Session } from "next-auth";
import React from "react";
import { Button } from "../ui/button";
import { signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";

type UserButtonProps = {
  session: Session | null;
};

const UserButton = ({ session }: UserButtonProps) => {
  const router = useRouter();
  return (
    <>
      {!session?.user ? (
        <li>
          <Button onClick={() => signIn()} className="space-x-1">
            <span>LogIn</span>
            <LogIn size={16} />
          </Button>
        </li>
      ) : (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={session.user?.image as string} />
                <AvatarFallback className="bg-primary/25 font-bold">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-6" align="end">
              <div className="mb-4 flex flex-col items-center gap-1 rounded-lg bg-primary/25 p-4">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user?.name ?? ""}
                    width={48}
                    height={48}
                    className="h-[48px] w-[48px] rounded-full"
                  />
                )}
                <p className="text-xs font-bold">{session.user?.name}</p>
                <span className="text-xs font-medium text-secondary-foreground">
                  {session.user.email}
                </span>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/orders")}
                className="group cursor-pointer py-2 font-medium "
              >
                <TruckIcon
                  size={14}
                  className="mr-3 transition-all duration-300 ease-in-out group-hover:translate-x-1"
                />{" "}
                My orders
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
                className="group cursor-pointer py-2 font-medium  ease-in-out "
              >
                <Settings
                  size={14}
                  className="mr-3 transition-all duration-300 ease-in-out group-hover:rotate-180"
                />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut()}
                className="group cursor-pointer py-2 font-medium focus:bg-destructive/30 "
              >
                <LogOut
                  size={14}
                  className="mr-3  transition-all duration-300 ease-in-out group-hover:scale-75"
                />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </>
  );
};

export default UserButton;
