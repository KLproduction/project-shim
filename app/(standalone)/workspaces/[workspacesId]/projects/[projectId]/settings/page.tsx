import { getCurrent, getProject } from "@/action/auth-action";
import { EditProjectForm } from "@/features/projects/_components/edit-project-form";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    projectId: string;
  };
};

const ProjectIdSettingsPage = async ({ params }: Props) => {
  const user = await getCurrent();
  if (user?.status !== 200) {
    redirect("/sign-in");
  }

  const result = await getProject({ projectId: params.projectId });
  if (result?.status !== 200) {
    throw new Error("Project not Found.");
  }
  const initialValues = result?.project!;
  return (
    <div className="lg-max-w-xl w-full">
      <div>
        <EditProjectForm initialValues={initialValues} />
      </div>
    </div>
  );
};

export default ProjectIdSettingsPage;
