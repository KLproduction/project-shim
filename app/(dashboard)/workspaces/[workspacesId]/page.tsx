import { getCurrent, getWorkspace } from "@/action/auth-action";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    workspacesId: string;
  };
};

const WorkspacePage = async ({ params }: Props) => {
  const user = await getCurrent();
  if (user?.status !== 200) {
    redirect("/sign-in");
  }
  const workspace = await getWorkspace();
  if (workspace?.workspaces?.total === 0) {
    redirect("/workspaces/create");
  }

  const { workspacesId } = params;
  return <div>{workspacesId}</div>;
};

export default WorkspacePage;
