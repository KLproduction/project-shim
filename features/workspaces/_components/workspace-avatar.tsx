import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  image?: string;
  name: string;
  className?: string;
};

const WorkspaceAvatar = ({ image, name, className }: Props) => {
  if (image) {
    return (
      <div
        className={cn(
          className,
          "relative size-10 overflow-hidden rounded-md ring-2 ring-green-500",
        )}
      >
        <Image
          src={image}
          alt="image"
          fill
          className="object-cover ring-2 ring-green-500"
        />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-10", className)}>
      <AvatarFallback className="flex items-center justify-center bg-green-500">
        <p className="text-xl font-black text-zinc-50">
          {name[0].toUpperCase()}
        </p>
      </AvatarFallback>
    </Avatar>
  );
};

export default WorkspaceAvatar;
