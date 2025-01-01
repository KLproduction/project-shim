"use client";

import DottedSeparator from "@/components/global/DottedSeparator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@/hooks/auth";
import Link from "next/link";
import React from "react";

type Props = {};

const SignUpCard = (props: Props) => {
  const {
    register,
    onSubmit,
    formState: { errors },
    isPending,
  } = useSignUp();
  return (
    <div>
      <Card className="h-full w-full border-2 border-primary shadow-none md:w-[400px]">
        <CardHeader className="flex items-center justify-center p-7 text-center">
          <CardTitle>Sign Up</CardTitle>
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
              {...register("name")}
              type="text"
              placeholder="Your name"
              disabled={isPending}
            />
            {errors && errors.name && (
              <p className="flex w-full justify-start text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
            <Input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
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
            <Input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm your password"
              disabled={isPending}
            />
            {errors && errors.confirmPassword && (
              <p className="flex w-full justify-start text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              Sign Up
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex w-full flex-col items-center justify-center p-7">
          <div>
            <span className="text-xs">{`Already have an account?`}</span>
            <Link href="/sign-in">
              <Button variant={"link"} size={"sm"}>
                Sign In
              </Button>
            </Link>
          </div>
          <CardDescription className="my-3">
            <span>By sign up you agree to our</span>
            <Link href={"#"}>
              <Button variant={"link"} className="text-blue-500">
                Terms and Conditions
              </Button>
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpCard;
