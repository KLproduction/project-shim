"use client";

import Logo from "@/components/global/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {};

const AuthNavBar = (props: Props) => {
  const pathname = usePathname();
  const isSignInPage = pathname === "/sign-in";
  const isSignUpPage = pathname === "/sign-up";
  return (
    <nav className="flex h-full w-full items-center justify-between px-5">
      <div>
        <Logo className="w-[150px] sm:w-[200px]" />
      </div>
      <Link href={isSignInPage ? "/sign-up" : "/sign-in"}>
        <Button>{isSignInPage ? "Sign Up" : "Sign In"}</Button>
      </Link>
    </nav>
  );
};

export default AuthNavBar;
