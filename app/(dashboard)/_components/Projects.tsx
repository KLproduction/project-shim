"use client";
import { RiAddCircleFill } from "react-icons/ri";

type Props = {};

const Projects = (props: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase text-zinc-800">
          Projects
        </p>
        <RiAddCircleFill
          size={20}
          className="cursor-pointer text-zinc-500 transition hover:opacity-75"
        />
      </div>
    </div>
  );
};

export default Projects;
