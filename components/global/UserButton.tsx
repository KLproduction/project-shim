"use client";

import { useLogout } from "@/features/auth/api/use-logout";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useCurrent } from "@/features/auth/api/use-current";
import MyLoader from "./loader/MyLoader";
import { Loader, LogOut } from "lucide-react";
import DottedSeparator from "./DottedSeparator";
import { Button } from "../ui/button";

type Props = {};

const UserButton = (props: Props) => {
  const { data: user, isLoading } = useCurrent();
  const { mutate: useLogOut } = useLogout();

  if (isLoading) {
    return (
      <div className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }
  const avatarFallback = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10 border border-neutral-300 transition-all hover:opacity-75">
          <AvatarFallback className="flex items-center justify-normal bg-zinc-200 font-medium text-zinc-500">
            <div className="flex h-full w-full items-center justify-center">
              {avatarFallback}
            </div>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2 py-4">
          <Avatar className="size-[52px] border-2 border-zinc-300 text-xl transition-all">
            <AvatarFallback className="flex items-center justify-normal bg-zinc-200 font-medium text-zinc-500">
              <div className="flex h-full w-full items-center justify-center">
                {avatarFallback}
              </div>
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-zinc-900">
              {user?.name ?? "User"}
            </p>
            <p className="text-xs font-medium text-zinc-500">{user?.email}</p>
          </div>
          <DottedSeparator className="mb-1" />
          <DropdownMenuItem
            className="flex h-10 w-full cursor-pointer items-center justify-center font-medium"
            onClick={() => useLogOut()}
          >
            <LogOut className="size-4" />
            Log Out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
