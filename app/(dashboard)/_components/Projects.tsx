"use client";
import { CreateProjectModel } from "@/features/projects/_components/create-project-model";
import ProjectAvatar from "@/features/projects/_components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/api/use-workplaceId";
import { useCreateProjectModel, useGetProjects } from "@/hooks/projects";
import { cn } from "@/lib/utils";
import { set } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

const Projects = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({ workspaceId: workspaceId });
  const { setIsOpen } = useCreateProjectModel();
  return (
    <div>
      <CreateProjectModel />
      <div className="my-4 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase text-zinc-800">
          Projects
        </p>
        <RiAddCircleFill
          size={20}
          className="cursor-pointer text-zinc-500 transition hover:opacity-75"
          onClick={() => setIsOpen(true)}
        />
      </div>
      {data?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;
        return (
          <Link href={href} key={project.id}>
            <div
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md p-2 text-zinc-500 hover:opacity-75",
                isActive
                  ? "bg-white text-primary shadow-sm hover:opacity-100"
                  : "",
              )}
            >
              <ProjectAvatar
                image={project.imageURL}
                name={project.name}
                className="size-5"
                fallbackClassName="size-5"
              />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Projects;
