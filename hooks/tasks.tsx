import { useProjectId } from "@/features/projects/api/use-workplaceId";
import { Task, TaskStatus } from "@/features/tasks/types";
import { useWorkspaceId } from "@/features/workspaces/api/use-workplaceId";
import { client } from "@/lib/rpc";
import { createTaskSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import {
  parseAsBoolean,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { parse } from "path";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { object, z } from "zod";

export const useCreateTasksModel = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
export const useEditTasksModel = () => {
  const [taskId, setTaskId] = useQueryState("edit-task", parseAsString);
  const open = (id: string) => setTaskId(id);
  const close = () => setTaskId(null);
  return {
    taskId,
    open,
    close,
    setTaskId,
  };
};

type useGetTasksProps = {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
};
export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  assigneeId,
  dueDate,
  search,
}: useGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      search,
      assigneeId,
      dueDate,
    ],
    queryFn: async () => {
      const response = await client.api.tasks["$get"]({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          search: search ?? undefined,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
type GetCurrentTaskProps = {
  taskId: string;
};
export const useGetCurrentTask = ({ taskId }: GetCurrentTaskProps) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"]["$get"]({
        param: { taskId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

type CreateTaskFormProps = {
  projectOptions: { id: string; name: string; imageURL: string }[];
  memberOptions: { id: string; name: string; email: string }[];
  onCancel?: () => void;
};
export const useCreateTask = ({
  projectOptions,
  memberOptions,
  onCancel,
}: CreateTaskFormProps) => {
  type ResponseType = InferResponseType<
    (typeof client.api.tasks)["$post"],
    200
  >;
  type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>;
  const queryClient = useQueryClient();
  const router = useRouter();
  const workplaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["$post"]({ json });
      const result = await response.json();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created");
      onCancel?.();
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: "",
      workspaceId: workplaceId,
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate({ json: values });
  };

  return {
    register,
    handleSubmit,
    errors,
    reset,
    getValues,
    setValue,
    watch,
    isPending,
    mutate,
    onSubmit,
  };
};
type EditTaskFormProps = {
  projectOptions: { id: string; name: string; imageURL: string }[];
  memberOptions: { id: string; name: string; email: string }[];
  onCancel?: () => void;
};
export const useDeleteTask = () => {
  type ResponseType = InferResponseType<
    (typeof client.api.tasks)[":taskId"]["$delete"],
    200
  >;
  type RequestType = InferRequestType<
    (typeof client.api.tasks)[":taskId"]["$delete"]
  >;
  const queryClient = useQueryClient();
  const router = useRouter();
  const workplaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[":taskId"]["$delete"]({ param });
      const result = await response.json();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", data.$id] });
      toast.success("Task Deleted");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  return {
    isPending,
    mutate,
  };
};

export const useTaskFilter = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};

type UpdateTaskFormProps = {
  projectOptions: { id: string; name: string; imageURL: string }[];
  memberOptions: { id: string; name: string; email: string }[];
  initialValues: Task;
  onCancel?: () => void;
};
export const useUpdateTask = ({
  projectOptions,
  memberOptions,
  initialValues,
  onCancel,
}: UpdateTaskFormProps) => {
  type ResponseType = InferResponseType<
    (typeof client.api.tasks)[":taskId"]["$patch"],
    200
  >;
  type RequestType = InferRequestType<
    (typeof client.api.tasks)[":taskId"]["$patch"]
  >;
  const queryClient = useQueryClient();
  const router = useRouter();
  const workplaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks[":taskId"]["$patch"]({
        json,
        param,
      });
      const result = await response.json();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", data.$id] });
      toast.success("Task Updated");
      router.refresh();
      onCancel?.();
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(
      createTaskSchema.omit({
        projectId: true,
        workspaceId: true,
        description: true,
      }),
    ),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate({ json: values, param: { taskId: initialValues.$id } });
  };

  return {
    register,
    handleSubmit,
    errors,
    reset,
    getValues,
    setValue,
    watch,
    isPending,
    mutate,
    onSubmit,
  };
};
