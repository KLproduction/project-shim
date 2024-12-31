"use client";

import { cn } from "@/lib/utils";
import { Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

type Props = {};
const routes = [
  { label: "Home", path: "/", icon: GoHome, activeIcon: GoHomeFill },
  {
    label: "My Tasks",
    path: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    activeIcon: Settings,
  },
  { label: "Members", path: "/members", icon: User, activeIcon: User },
];
const SideBarNavigation = (props: Props) => {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const isActive = pathname.includes(item.path);
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "grid grid-cols-3 gap-4 rounded-md px-4 py-3 text-sm font-bold text-zinc-500 opacity-80 transition-colors duration-200 ease-in-out hover:bg-zinc-50 hover:text-primary hover:opacity-100",
              isActive && "text-primary hover:opacity-100",
            )}
          >
            <Icon className="size-5" />
            <span className="col-span-2">{item.label}</span>
          </Link>
        );
      })}
    </ul>
  );
};

export default SideBarNavigation;
