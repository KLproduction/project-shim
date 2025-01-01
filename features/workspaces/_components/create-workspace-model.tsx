"use client";

import ResponsiveModel from "@/components/global/responsive-model";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { useCreateWorkspaceModel } from "@/hooks/workspace";

export const CreateWorkspaceModel = () => {
  const { close, isOpen, setIsOpen } = useCreateWorkspaceModel();
  return (
    <ResponsiveModel isOpen={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModel>
  );
};
