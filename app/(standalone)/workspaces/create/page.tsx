import { getCurrent } from "@/action/auth-action";
import UserButton from "@/components/global/UserButton";
import { CreateWorkspaceForm } from "@/features/workspaces/_components/create-workspace-form";
import { useCreateWorkspaceModel } from "@/hooks/workspace";
import { redirect } from "next/navigation";

const WorkspaceCreatePage = async () => {
  const user = await getCurrent();

  if (user?.status !== 200) {
    redirect("/sign-in");
  }

  return (
    <div className="mt-12 flex w-full items-center justify-center lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
