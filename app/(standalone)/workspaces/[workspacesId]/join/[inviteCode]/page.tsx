import { getCurrent, getWorkspaceInfo } from "@/action/auth-action";
import JoinWorkspaceForm from "@/features/workspaces/_components/join-workspace-form";
import { redirect } from "next/navigation";

type Props = {
  params: {
    workspacesId: string;
    inviteCode: string;
  };
};

const WorkspaceIdJoinPage = async ({ params }: Props) => {
  const user = await getCurrent();

  if (user?.status !== 200) {
    redirect("/sign-in");
  }

  const initialValues = await getWorkspaceInfo({
    workspaceId: params.workspacesId,
  });

  if (!initialValues) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Invalid Invite Link</h1>
          <p className="text-gray-500">
            The invite link you are trying to use is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full lg:max-w-lg">
      <JoinWorkspaceForm
        initialValues={{
          name: initialValues.name || "",
          inviteCode: params.inviteCode,
          workspaceId: params.workspacesId,
        }}
      />
    </div>
  );
};

export default WorkspaceIdJoinPage;
