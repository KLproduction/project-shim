import { Card, CardContent } from "@/components/ui/card";
import { useWorkspaceId } from "@/features/workspaces/api/use-workplaceId";
import { useGetMembers } from "@/hooks/members";
import { useGetProjects } from "@/hooks/projects";
import { Loader } from "lucide-react";
import React from "react";
import { CreateTaskForm } from "./create-task-form";
import { useGetCurrentTask } from "@/hooks/tasks";
import { EditTaskForm } from "./edit-task-form";

type Props = {
  taskId: string;
  onCancel?: () => void;
};

const EditTaskFormWrapper = ({ taskId, onCancel }: Props) => {
  const workspaceId = useWorkspaceId();
  const { data: initialValues, isLoading: isTaskLoading } = useGetCurrentTask({
    taskId: taskId,
  });
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

  const isLoading = isProjectsLoading || isMembersLoading || isTaskLoading;

  if (isLoading) {
    return (
      <Card className="h-[750px] w-full border-none shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return (
      <div className="flex h-[750px] w-full items-center justify-center">
        No Task Found
      </div>
    );
  }

  return (
    <div>
      <EditTaskForm
        projectOptions={projectOptions ?? []}
        memberOptions={memberOptions ?? []}
        onCancel={onCancel}
        initialValues={initialValues}
      />
    </div>
  );
};

export default EditTaskFormWrapper;
