import { getCurrent } from "@/action/auth-action";
import UserButton from "@/components/global/UserButton";
import { CreateWorkspaceForm } from "@/features/workspaces/_components/create-workspace-form";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const user = await getCurrent();

  if (user?.status !== 200) {
    redirect("/sign-in");
  }

  return (
    <div className="min-w-screen mt-12 flex items-center justify-center">
      <CreateWorkspaceForm />
    </div>
  );
};

export default HomePage;
