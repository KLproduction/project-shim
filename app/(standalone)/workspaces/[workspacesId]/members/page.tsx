import { getCurrent } from "@/action/auth-action";
import MembersList from "@/features/members/_compoents/members-list";
import { useGetMembers } from "@/hooks/members";
import { get } from "http";
import { redirect } from "next/navigation";

type Props = {
  params: {
    workspaceId: string;
  };
};

const WorkspaceIdMemberPage = async ({ params: { workspaceId } }: Props) => {
  const user = await getCurrent();

  if (user?.status !== 200) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default WorkspaceIdMemberPage;
