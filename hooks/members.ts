"use client";

import { client } from "@/lib/rpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useDeleteMember = () => {
  type ResponseType = InferResponseType<
    (typeof client.api.members)[":memberId"]["$delete"],
    200
  >;
  type RequestType = InferRequestType<
    (typeof client.api.members)[":memberId"]["$delete"]
  >;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deleteMemberMutate, isPending: isDeletingMember } =
    useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ param }) => {
        const response = await client.api.members[":memberId"]["$delete"]({
          param,
        });
        const result = await response.json();
        if ("error" in result) {
          throw new Error(result.error);
        }
        return result;
      },
      onSuccess: async ({ data }) => {
        queryClient.invalidateQueries({ queryKey: ["members"] });
        toast.success("Member deleted");
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });
  return { deleteMemberMutate, isDeletingMember };
};
export const useUpdateMember = () => {
  type ResponseType = InferResponseType<
    (typeof client.api.members)[":memberId"]["$patch"],
    200
  >;
  type RequestType = InferRequestType<
    (typeof client.api.members)[":memberId"]["$patch"]
  >;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: updateMemberMutate, isPending: isUpdatingMember } =
    useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ param, json }) => {
        const response = await client.api.members[":memberId"]["$patch"]({
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
        queryClient.invalidateQueries({ queryKey: ["members"] });
        toast.success("Role updated");
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });
  return { updateMemberMutate, isUpdatingMember };
};

type UseGetMembersProps = {
  workspaceId: string;
};
export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members["$get"]({
        query: { workspaceId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      return await response.json();
    },
  });
  return query;
};
