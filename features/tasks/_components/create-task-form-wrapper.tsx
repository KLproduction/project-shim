import { Card, CardContent } from "@/components/ui/card";
import { useWorkspaceId } from "@/features/workspaces/api/use-workplaceId";
import { useGetMembers } from "@/hooks/members";
import { useGetProjects } from "@/hooks/projects";
import { Loader } from "lucide-react";
import React from "react";
import { CreateTaskForm } from "./create-task-form";

type Props = {
  onCancel?: () => void;
};

const CreateTaskFormWrapper = ({ onCancel }: Props) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId: workspaceId,
  });
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId: workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageURL: project.imageURL,
  }));
  const memberOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
    email: member.email,
  }));

  const isLoading = isProjectsLoading || isMembersLoading;

  if (isLoading) {
    return (
      <Card className="h-[750px] w-full border-none shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <CreateTaskForm
        projectOptions={projectOptions ?? []}
        memberOptions={memberOptions ?? []}
        onCancel={onCancel}
      />
    </div>
  );
};

export default CreateTaskFormWrapper;
