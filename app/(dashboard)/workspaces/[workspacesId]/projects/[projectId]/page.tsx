import { getCurrent, getProject } from "@/action/auth-action";
import { Button } from "@/components/ui/button";
import ProjectAvatar from "@/features/projects/_components/project-avatar";
import TaskViewSwitcher from "@/features/tasks/_components/task-veiw-switcher";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    projectId: string;
  };
};

const ProjectIdPage = async ({ params }: Props) => {
  const user = await getCurrent();
  if (user?.status !== 200) {
    redirect("/sign-in");
  }
  const response = await getProject({ projectId: params.projectId });

  if (response?.status !== 200) {
    throw new Error("Project not Found.");
  }

  const initialValues = response.project;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProjectAvatar
            className="size-10"
            fallbackClassName="size-10"
            image={initialValues?.imageURL}
            name={initialValues?.name!}
          />
          {initialValues?.name}
        </div>
        <div>
          <Button variant={"secondary"} asChild>
            <Link
              className="flex items-center justify-center gap-3"
              href={`/workspaces/${initialValues?.workspaceId}/projects/${initialValues?.$id}/settings`}
            >
              <PencilIcon />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher />
    </div>
  );
};

export default ProjectIdPage;
