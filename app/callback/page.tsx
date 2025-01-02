import { getCurrent, getWorkspaces } from "@/action/auth-action";
import { redirect } from "next/navigation";

type Props = {};

const page = async (props: Props) => {
  const user = await getCurrent();
  const workspace = await getWorkspaces();
  if (user?.status !== 200) {
    redirect("/sign-in");
  }

  if (workspace?.workspaces?.total === 0 || !workspace) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspace?.workspaces?.documents[0].$id}`);
  }
};

export default page;
