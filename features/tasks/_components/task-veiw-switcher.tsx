"use client";

import DottedSeparator from "@/components/global/DottedSeparator";
import MyLoader from "@/components/global/loader/MyLoader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspaces/api/use-workplaceId";
import { useCreateTasksModel, useGetTasks, useTaskFilter } from "@/hooks/tasks";
import { PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import TaskFilter from "./task-filter";
import { DataTable } from "./TaskTable/data-table";
import { columns } from "./TaskTable/columns";

const TaskViewSwitcher = () => {
  const { open } = useCreateTasksModel();
  const workspaceId = useWorkspaceId();

  const [{ status, assigneeId, projectId, dueDate }] = useTaskFilter();

  const { data: tasks, isLoading: isTaskLoading } = useGetTasks({
    workspaceId,
    status,
    assigneeId,
    projectId,
    dueDate,
  });

  const [view, setView] = useQueryState("task-view", { defaultValue: "table" });

  return (
    <Tabs
      className="w-full flex-1 rounded-lg border"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button size={"sm"} className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="mr-2 size-4" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        {/* Add filter */}
        <TaskFilter />
        <DottedSeparator className="my-4" />
        {isTaskLoading ? (
          <MyLoader />
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
