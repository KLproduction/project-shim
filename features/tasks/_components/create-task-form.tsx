"use client";

import DatePicker from "@/components/global/date-picker";
import DottedSeparator from "@/components/global/DottedSeparator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspaceId } from "@/features/workspaces/api/use-workplaceId";
import { useCreateTask } from "@/hooks/tasks";
import { cn } from "@/lib/utils";
import { TaskStatus } from "../types";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageURL: string }[];
  memberOptions: { id: string; name: string; email: string }[];
};

export const CreateTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
}: Props) => {
  const {
    register,
    errors,
    handleSubmit,
    isPending,
    onSubmit,
    getValues,
    setValue,
    watch,
  } = useCreateTask({ projectOptions, memberOptions, onCancel });
  const workplaceId = useWorkspaceId();

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="flex w-full justify-center p-7">
        <CardTitle className="text-xl font-bold">Create a task</CardTitle>
      </CardHeader>
      <div className="p-7">
        <DottedSeparator />
      </div>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center justify-center space-y-4"
        >
          <Input
            {...register("workspaceId")}
            type="hidden"
            value={workplaceId}
          />
          <Label className="w-full text-start">Task Name </Label>
          <Input {...register("name")} placeholder="Enter Task Name" />
          {errors && errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}

          <Label className="w-full text-start">Due Date </Label>

          <DatePicker
            {...register("dueDate")}
            value={watch("dueDate")}
            onChange={(date) => setValue("dueDate", date)}
          />
          {errors && errors.dueDate && (
            <span className="text-sm text-red-500">
              {errors.dueDate.message}
            </span>
          )}

          <Label className="w-full text-start">Project</Label>
          <select
            {...register("projectId")}
            className="w-full rounded border-2 border-zinc-100 bg-white p-2 text-sm shadow-sm"
          >
            <option value="" disabled>
              Select a Project
            </option>
            {projectOptions?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.assigneeId && (
            <span className="text-sm text-red-500">
              {errors.assigneeId.message}
            </span>
          )}
          <Label className="w-full text-start">Assignee</Label>
          <select
            {...register("assigneeId")}
            className="w-full rounded border-2 border-zinc-100 bg-white p-2 text-sm shadow-sm"
          >
            <option value="" disabled>
              Select an assignee
            </option>
            {memberOptions?.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          {errors.assigneeId && (
            <span className="text-sm text-red-500">
              {errors.assigneeId.message}
            </span>
          )}

          <Label className="w-full text-start">Status</Label>
          <select
            {...register("status")}
            className="w-full rounded border-2 border-zinc-100 bg-white p-2 text-sm shadow-sm"
          >
            <option value="" disabled>
              Select a status
            </option>
            {Object.values(TaskStatus).map((status) => (
              <option key={status} value={status} className="cursor-pointer">
                {status.split("_").join(" ")}
              </option>
            ))}
          </select>
          {errors.status && (
            <span className="text-sm text-red-500">
              {errors.status.message}
            </span>
          )}

          <Textarea
            {...register("description")}
            onChange={(e) => setValue("description", e.target.value)}
            className="w-full"
            placeholder="Enter a description"
            rows={6}
          />

          <DottedSeparator className="p-7" />

          <div className={cn("flex w-full items-center justify-between")}>
            <Button
              onClick={onCancel}
              type="button"
              variant={"outline"}
              size={"lg"}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" size={"lg"} disabled={isPending}>
              Create Task
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
