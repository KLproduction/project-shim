import React from "react";
import AuthNavBar from "./_components/AuthNavBar";
import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <main className="min-h-screen bg-primary-foreground">
      <div className="mx-auto max-w-screen-2xl p-4">
        <AuthNavBar />
        {children}
      </div>
      <Toaster />
    </main>
  );
};

export default layout;
