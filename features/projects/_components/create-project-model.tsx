"use client";

import ResponsiveModel from "@/components/global/responsive-model";

import { useCreateWorkspaceModel } from "@/hooks/workspace";
import { CreateProjectForm } from "./create-project-form";
import { useCreateProjectModel } from "@/hooks/projects";

export const CreateProjectModel = () => {
  const { close, isOpen, setIsOpen } = useCreateProjectModel();
  return (
    <ResponsiveModel isOpen={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModel>
  );
};
