import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  name: string;
  className?: string;
  fallbackClassName?: string;
};

const MemberAvatar = ({ name, className, fallbackClassName }: Props) => {
  return (
    <Avatar
      className={cn(
        "size-5 rounded-full border border-zinc-300 transition",
        className,
      )}
    >
      <AvatarFallback
        className={cn(
          "flex items-center justify-center bg-zinc-500",
          fallbackClassName,
        )}
      >
        <p className="font-black text-zinc-50">
          {name.charAt(0).toUpperCase()}
        </p>
      </AvatarFallback>
    </Avatar>
  );
};

export default MemberAvatar;
