import { getCurrent } from "@/action/auth-action";
import DashboardNavBar from "../(dashboard)/_components/DashboardNavBar";
import { redirect } from "next/navigation";

type Props = {};

const HomePage = async (props: Props) => {
  const user = await getCurrent();
  if (user?.status !== 200) {
    redirect("/callback");
  }
  return (
    <div>
      <DashboardNavBar />
    </div>
  );
};

export default HomePage;
