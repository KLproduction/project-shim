import { createWorkspaceSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

export const useWorkspaceForm = () => {};

type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces["$post"]({ form });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("workspace created");
      reset();
      // router.push("/workspaces");
    },
    onError: (error) => {
      toast.error(
        "something went wrong. Please check the accepted format and size.",
      );
      console.log(error);
    },
    onSettled: (data) => {},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate({ form: finalValues });
  };

  return {
    register,
    onSubmit,
    errors,
    isPending,
    handleSubmit,
    getValues,
    setValue,
    watch,
  };
};

export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces["$get"]();
      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};