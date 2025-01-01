import React from "react";
import SignUpCard from "../_components/SignUpCard";
import { getCurrent } from "@/action/auth-action";
import { redirect } from "next/navigation";

type Props = {};

const SignUpPage = async (props: Props) => {
  const user = await getCurrent();

  if (user?.status === 200) {
    redirect("/callback");
  }
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SignUpCard />
    </div>
  );
};

export default SignUpPage;
