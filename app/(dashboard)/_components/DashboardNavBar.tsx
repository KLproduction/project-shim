import UserButton from "@/components/global/UserButton";
import React from "react";
import MobileSideBar from "./MobileSideBar";
import ThemeSwitcher from "@/components/global/ThemeSwitcher";

type Props = {};

const DashboardNavBar = (props: Props) => {
  return (
    <nav className="flex w-full items-center justify-between px-6 pt-4 text-zinc-500">
      <div className="hidden flex-col lg:block">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p>Monitor all of your projects and tasks here</p>
      </div>
      {/* <ThemeSwitcher /> */}
      <MobileSideBar />
      <UserButton />
    </nav>
  );
};

export default DashboardNavBar;
