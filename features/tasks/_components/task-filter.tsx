"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "../types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Folder, ListCheckIcon, UserIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useGetProjects } from "@/hooks/projects";
import { use } from "react";
import { useWorkspaceId } from "@/features/workspaces/api/use-workplaceId";
import { useGetMembers } from "@/hooks/members";
import MyLoader from "@/components/global/loader/MyLoader";
import { useTaskFilter } from "@/hooks/tasks";
import MemberAvatar from "@/features/members/_compoents/members-avatar";
import DatePicker from "@/components/global/date-picker";

type Props = {
  hideProjectFilter?: boolean;
};

const TaskFilter = ({ hideProjectFilter }: Props) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  });
  const isLoading = isProjectsLoading || isMembersLoading;

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

  const [{ status, assigneeId, projectId, dueDate }, setFilters] =
    useTaskFilter();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };
  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : (value as string) });
  };
  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : (value as string) });
  };

  if (isLoading) return <MyLoader />;
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Task Search</h1>
      <div className="mb-4 flex flex-col items-center gap-4 md:flex-row">
        <Select
          defaultValue={status ?? undefined}
          onValueChange={(value) => {
            onStatusChange(value);
          }}
        >
          <SelectTrigger className="bg-zinc-50">
            <div className="flex items-center gap-2">
              <ListCheckIcon className="size-4" />
              <SelectValue placeholder="All Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>All Status</SelectItem>
            <SelectSeparator />
            <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
            <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
            <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
            <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue={assigneeId ?? undefined}
          onValueChange={(value) => {
            onAssigneeChange(value);
          }}
        >
          <SelectTrigger className="bg-zinc-50">
            <div className="flex items-center gap-2">
              <UserIcon className="size-4" />
              <SelectValue placeholder="All Assignees" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>All Assignees</SelectItem>
            <SelectSeparator />
            {memberOptions?.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => {
            onProjectChange(value);
          }}
        >
          <SelectTrigger className="bg-zinc-50">
            <div className="flex items-center gap-2">
              <Folder className="size-4" />
              <SelectValue placeholder="All Projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>All Projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex w-full items-center">
          <DatePicker
            value={dueDate ? new Date(dueDate) : undefined}
            onChange={(date) =>
              setFilters({ dueDate: date ? date?.toISOString() : null })
            }
            className="h-8 w-full lg:w-auto"
          />
          {dueDate && (
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setFilters({ dueDate: null })}
              className="p-0"
            >
              <X className="size-1 text-red-500" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;
