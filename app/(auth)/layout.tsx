import React from "react";
import AuthNavBar from "./_components/AuthNavBar";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <AuthNavBar />
        {children}
      </div>
    </main>
  );
};

export default layout;
