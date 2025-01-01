import { getCurrent, getWorkspace } from "@/action/auth-action";
import { redirect } from "next/navigation";

type Props = {};

const page = async (props: Props) => {
  const user = await getCurrent();
  const workspace = await getWorkspace();
  if (user?.status !== 200) {
    redirect("/sign-in");
  }
  console.log(workspace);
  if (workspace?.workspaces?.total === 0 || !workspace) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspace?.workspaces?.documents[0].$id}`);
  }
};

export default page;
