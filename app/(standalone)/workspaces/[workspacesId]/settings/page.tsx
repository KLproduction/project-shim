import { getCurrent, getWorkspace } from "@/action/auth-action";
import { EditWorkspaceForm } from "@/features/workspaces/_components/edit-workspace-form";
import { Edit } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
  params: {
    workspacesId: string;
  };
};

const WorkspaceIdSettingsPage = async ({ params }: Props) => {
  const user = await getCurrent();
  if (user?.status !== 200) {
    redirect("/sign-in");
  }
  const initialValues = await getWorkspace({
    workspaceId: params.workspacesId,
  });
  if (!initialValues) {
    redirect(`/workspaces/${params.workspacesId}`);
  }
  return (
    <div className="mt-12 flex w-full items-center justify-center lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues.workspace!} />
    </div>
  );
};

export default WorkspaceIdSettingsPage;
