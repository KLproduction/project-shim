import React from "react";
import SignInCard from "../_components/SignInCard";
import { getCurrent } from "@/action/auth-action";
import { redirect } from "next/navigation";

type Props = {};

const SignInPage = async (props: Props) => {
  const user = await getCurrent();

  if (user?.status === 200) {
    redirect("/callback");
  }
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SignInCard />
    </div>
  );
};

export default SignInPage;
