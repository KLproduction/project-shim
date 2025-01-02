import { createWorkspaceSchema, updateWorkspaceSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useQueryState, parseAsBoolean } from "nuqs";
import { useRouter } from "next/navigation";
import { Workspace } from "@/features/workspaces/type";
import { getWorkspaces } from "@/action/auth-action";
import { Button, ButtonProps } from "@/components/ui/button";
import { useState } from "react";
import { JSX } from "react";
import ResponsiveModel from "@/components/global/responsive-model";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const useWorkspaceForm = () => {};

export const useCreateWorkspace = () => {
  type ResponseType = InferResponseType<
    (typeof client.api.workspaces)["$post"]
  >;
  type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces["$post"]({ form });
      return response.json();
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("workspace created");
      router.push(`/workspaces/${data.$id}`);
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
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

export const useUpdateWorkspace = (initialValues: Workspace) => {
  type ResponseType = InferResponseType<
    (typeof client.api.workspaces)[":workspaceId"]["$patch"],
    200
  >;
  type RequestType = InferRequestType<
    (typeof client.api.workspaces)[":workspaceId"]["$patch"]
  >;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$patch"]({
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
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] });
      toast.success("workspace updated");
      router.push(`/workspaces/${data.$id}`);
    },
    onError: (error) => {
      toast.error(error.message);
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
  } = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: { ...initialValues, image: initialValues.imageURL ?? "" },
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate({ form: finalValues, param: { workspaceId: initialValues.$id } });
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

export const useDeleteWorkspace = () => {
  type ResponseType = InferResponseType<
    (typeof client.api.workspaces)[":workspaceId"]["$delete"],
    200
  >;
  type RequestType = InferRequestType<
    (typeof client.api.workspaces)[":workspaceId"]["$delete"]
  >;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ param }) => {
        const response = await client.api.workspaces[":workspaceId"]["$delete"](
          {
            param,
          },
        );
        const result = await response.json();
        if ("error" in result) {
          throw new Error(result.error);
        }
        return result;
      },
      onSuccess: async ({ data }) => {
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] });
        toast.success("workspace deleted");
        router.push("/callback");
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });
  return { deleteWorkspace, isDeletingWorkspace };
};
export const useResetInviteCode = () => {
  type ResponseType = InferResponseType<
    (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"],
    200
  >;
  type RequestType = InferRequestType<
    (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
  >;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: resetInviteCodeMutate, isPending: isResettingInviteCode } =
    useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ param }) => {
        const response = await client.api.workspaces[":workspaceId"][
          "reset-invite-code"
        ]["$post"]({
          param,
        });
        const result = await response.json();
        if ("error" in result) {
          throw new Error(result.error);
        }
        return result;
      },
      onSuccess: async ({ data }) => {
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        queryClient.invalidateQueries({
          queryKey: ["workspaces", data.workspace.$id],
        });
        toast.success("Invite code reset");
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });
  return { resetInviteCodeMutate, isResettingInviteCode };
};
export const useJoinWorkspace = () => {
  type ResponseType = InferResponseType<
    (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"],
    200
  >;
  type RequestType = InferRequestType<
    (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
  >;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: joinWorkspaceMutate, isPending: isJoiningWorkspace } =
    useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ param, json }) => {
        const response = await client.api.workspaces[":workspaceId"]["join"][
          "$post"
        ]({
          param,
          json,
        });
        const result = await response.json();
        if ("error" in result) {
          throw new Error(result.error);
        }
        return result;
      },
      onSuccess: async ({ data }) => {
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        queryClient.invalidateQueries({
          queryKey: ["workspaces", data.workspace.$id],
        });
        toast.success("Joined workspace");
        router.push(`/workspaces/${data.workspace.$id}`);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });
  return { joinWorkspaceMutate, isJoiningWorkspace };
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

export const useCreateWorkspaceModel = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-workspace",
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

export const useConfirm = (
  title: string,
  message: string,
  variant: ButtonProps["variant"] = "default",
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = (value: boolean) => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ResponsiveModel isOpen={promise !== null} onOpenChange={handleClose}>
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="pt-8">
          <CardHeader className="p-0">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <div className="flex w-full flex-col items-center justify-end gap-2 pt-4 lg:flex-row">
            <Button
              onClick={handleClose}
              variant={"outline"}
              className="w-full lg:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirm(true)}
              variant={variant}
              className="w-full lg:w-auto"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModel>
  );

  return [ConfirmationDialog, confirm];
};
