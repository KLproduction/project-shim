import React from "react";
import DashboardSidebar from "./_components/DashboardSidebar";
import DashboardNavBar from "./_components/DashboardNavBar";
import "../globals.css";
import { CreateWorkspaceModel } from "@/features/workspaces/_components/create-workspace-model";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import CreateTaskModel from "@/features/tasks/_components/careate-task-model";
type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <NuqsAdapter>
      <div className="min-h-screen w-full bg-zinc-100">
        <CreateTaskModel />
        <CreateWorkspaceModel />
        <div className="flex h-full w-full">
          <div className="fixed left-0 top-0 hidden h-full overflow-y-auto lg:block lg:w-[264px]">
            <DashboardSidebar />
          </div>
          <div className="w-full lg:pl-[264px]">
            <div className="mx-auto h-full max-w-screen-2xl">
              <DashboardNavBar />

              <main className="flex h-full flex-col px-6 py-8">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </NuqsAdapter>
  );
};

export default DashboardLayout;
