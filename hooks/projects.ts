import { useProjectId } from "@/features/projects/api/use-workplaceId";
import { Project } from "@/features/projects/type";
import { useWorkspaceId } from "@/features/workspaces/api/use-workplaceId";
import { client } from "@/lib/rpc";
import { createProjectSchema, updateProjectSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type useGetProjectsProps = {
  workspaceId: string;
};
export const useGetProjects = ({ workspaceId }: useGetProjectsProps) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.projects["$get"]({
        query: { workspaceId },
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

export const useCreateProject = () => {
  type ResponseType = InferResponseType<
    (typeof client.api.projects)["$post"],
    200
  >;
  type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;
  const queryClient = useQueryClient();
  const router = useRouter();
  const workplaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects["$post"]({ form });
      const result = await response.json();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created");
      router.push(`/workspaces/${workplaceId}/projects/${data.$id}`);
      reset();
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
  } = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate({ form: finalValues });
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

type useUpdateProjectProps = {
  initialValues: Project;
};

export const useUpdateProject = ({ initialValues }: useUpdateProjectProps) => {
  type ResponseType = InferResponseType<
    (typeof client.api.projects)[":projectId"]["$patch"],
    200
  >;
  type RequestType = InferRequestType<
    (typeof client.api.projects)[":projectId"]["$patch"]
  >;
  const queryClient = useQueryClient();
  const router = useRouter();
  const projectId = useProjectId();

  const { mutate, isPending } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.projects[":projectId"]["$patch"]({
        form,
        param,
      });
      const result = await response.json();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", data.$id] });
      toast.success("Project Updated");
      router.refresh();
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
  } = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: { name: initialValues.name, image: initialValues.imageURL },
  });

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate({ form: finalValues, param: { projectId: projectId } });
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

export const useCreateProjectModel = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-project",
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

export const useDeleteProject = () => {
  type ResponseType = InferResponseType<
    (typeof client.api.projects)[":projectId"]["$delete"],
    200
  >;
  type RequestType = InferRequestType<
    (typeof client.api.projects)[":projectId"]["$delete"]
  >;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deleteProjectMutate, isPending: isDeletingProject } =
    useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ param }) => {
        const response = await client.api.projects[":projectId"]["$delete"]({
          param,
        });
        const result = await response.json();
        if ("error" in result) {
          throw new Error(result.error);
        }
        return result;
      },
      onSuccess: async ({ data }) => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        queryClient.invalidateQueries({ queryKey: ["projects", data.$id] });
        toast.success("Project deleted");
        router.push("/callback");
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });
  return { deleteProjectMutate, isDeletingProject };
};
