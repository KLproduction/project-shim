"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const ErrorPage = (props: Props) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-gray-800">
      {/* Icon Section */}
      <div className="mb-4 flex items-center justify-center text-red-500">
        <AlertTriangle className="size-10" />
      </div>

      {/* Error Message */}
      <p className="mb-6 text-lg font-semibold">Something went wrong</p>

      {/* Button Section */}
      <Button
        asChild
        variant={"outline"}
        className="rounded-lg px-6 font-medium shadow-md transition"
      >
        <Link href="/callback">Back to Home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
