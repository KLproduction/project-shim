"use client";

import DottedSeparator from "@/components/global/DottedSeparator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignIn } from "@/hooks/auth";
import { Car } from "lucide-react";
import Link from "next/link";
import React from "react";
import { AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";

type Props = {};

const SignInCard = (props: Props) => {
  const { register, onSubmit, errors, isPending } = useSignIn();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Card className="h-full w-full border-2 border-primary bg-background shadow-none md:w-[400px]">
        <CardHeader className="flex items-center justify-center p-7 text-center">
          <CardTitle>Welcome Back</CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="flex w-full flex-col items-center justify-center p-7">
          <form
            className="flex w-full flex-col items-center justify-center space-y-4"
            onSubmit={onSubmit}
          >
            <Input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              disabled={isPending}
            />
            {errors && errors.email && (
              <p className="flex w-full justify-start text-sm text-red-500">
                {errors.email.message}
              </p>
            )}

            <Input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              disabled={isPending}
            />
            {errors && errors.password && (
              <p className="flex w-full justify-start text-sm text-red-500">
                {errors.password.message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              Sign In
            </Button>
          </form>
        </CardContent>
        <div className="px-7">
          <DottedSeparator />
          <CardContent className="flex flex-col items-center justify-center gap-4 p-7">
            <Button variant={"default"} className="flex w-full items-center">
              <AiOutlineGoogle />
              Login with Google
            </Button>
            <Button variant={"default"} className="flex w-full items-center">
              <AiOutlineGithub />
              Login with GitHub
            </Button>
          </CardContent>
        </div>
        <CardFooter className="flex w-full items-center justify-center p-7">
          <div>
            <span className="text-xs">{`Don't have an account?`}</span>
            <Link href="/sign-up">
              <Button variant={"link"} size={"xs"}>
                Sign Up
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInCard;
