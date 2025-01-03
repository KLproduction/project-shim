import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
};

const ProjectAvatar = ({
  image,
  name,
  className,
  fallbackClassName,
}: Props) => {
  if (image) {
    return (
      <div
        className={cn(
          className,
          "relative overflow-hidden rounded-md ring-2 ring-green-500",
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
    <Avatar className={cn("", className)}>
      <AvatarFallback
        className={cn(
          "flex items-center justify-center bg-green-500",
          fallbackClassName,
        )}
      >
        <p className="text-sm font-black text-zinc-50">
          {name[0].toUpperCase()}
        </p>
      </AvatarFallback>
    </Avatar>
  );
};

export default ProjectAvatar;
