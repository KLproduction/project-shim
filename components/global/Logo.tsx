import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
};

const Logo = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "relative flex justify-center items-center w-[200px] h-[50px]",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 50"
        className="relative w-full h-full "
      >
        <text
          x="50%"
          y="50%"
          fill="#92aba6"
          fontSize="4rem"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            letterSpacing: "-0.05em",
          }}
        >
          PROJECT
        </text>

        <text
          x="50%"
          y="95%"
          fill="#474f3f"
          fontSize="1.25rem"
          fontWeight="800"
          textAnchor="middle"
          style={{
            letterSpacing: "0.5em",
          }}
        >
          SHIM
        </text>
      </svg>
    </div>
  );
};

export default Logo;

{
  /* <h1 className="text-4xl font-bold tracking-tighter text-accent ">
  PROJECT
</h1>
<span className="absolute text-xl font-black tracking-widest text-zinc-900 -bottom-3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  SHIM
</span> */
}
