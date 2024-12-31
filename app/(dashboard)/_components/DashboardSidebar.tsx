import DottedSeparator from "@/components/global/DottedSeparator";
import Logo from "@/components/global/Logo";
import Link from "next/link";
import React from "react";
import SideBarNavigation from "./SideBarNavigation";
import WorkspaceSwitcher from "./WorkspaceSwitcher";

type Props = {};

const DashboardSidebar = (props: Props) => {
  return (
    <aside className="h-full w-full bg-zinc-100 p-4">
      <Link href={"/"} className="flex w-full justify-center">
        <Logo />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <SideBarNavigation />
    </aside>
  );
};

export default DashboardSidebar;
