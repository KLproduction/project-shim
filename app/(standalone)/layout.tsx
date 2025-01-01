import Logo from "@/components/global/Logo";
import UserButton from "@/components/global/UserButton";
import Link from "next/link";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <main className="min-h-screen w-screen bg-gray-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex h-12 items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <UserButton />
        </nav>
        <div className="flex w-full flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default layout;
