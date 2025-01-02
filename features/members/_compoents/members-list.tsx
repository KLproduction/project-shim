"use client";

import DottedSeparator from "@/components/global/DottedSeparator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceId } from "@/features/workspaces/api/use-workplaceId";
import {
  useDeleteMember,
  useGetMembers,
  useUpdateMember,
} from "@/hooks/members";
import { ArrowLeft, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import MemberAvatar from "./members-avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { MemberRole } from "../types";
import { useConfirm } from "@/hooks/workspace";
import { ok } from "assert";

type Props = {};

const MembersList = (props: Props) => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetMembers({ workspaceId: workspaceId as string });
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace",
    "destructive",
  );
  const handleDelete = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;
    deleteMemberMutate({ param: { memberId } });
  };
  const { deleteMemberMutate, isDeletingMember } = useDeleteMember();
  const { updateMemberMutate, isUpdatingMember } = useUpdateMember();

  return (
    <Card className="w-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-4 p-7">
        <Button variant={"link"} size={"sm"} asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold"> Member List</CardTitle>
      </CardHeader>
      <DottedSeparator className="p-7" />
      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <div
            key={member.$id}
            className="mt-6 flex items-center justify-start gap-3"
          >
            <MemberAvatar
              className="size-10"
              fallbackClassName="text-lg"
              name={member.name}
            />

            <div className="flex flex-col">
              <p className="text-md font-bold">{member.name}</p>
              <p className="text-sm text-zinc-500">{member.email}</p>
            </div>
            {member.role === MemberRole.ADMIN && (
              <span className="mx-auto rounded-lg bg-primary p-2 text-sm text-zinc-50">
                Admin
              </span>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size={"icon"}
                  variant={"secondary"}
                  className="ml-auto hover:bg-none hover:text-primary"
                >
                  <MoreVerticalIcon size={4} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="rounded-xl border border-zinc-500 bg-white shadow-md"
                side="bottom"
                align="end"
              >
                <DropdownMenuItem
                  className="font-medium"
                  onClick={() =>
                    updateMemberMutate({
                      param: { memberId: member.$id },
                      json: { role: MemberRole.ADMIN },
                    })
                  }
                  disabled={isUpdatingMember}
                >
                  Set as Administrator
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="font-medium"
                  onClick={() =>
                    updateMemberMutate({
                      param: { memberId: member.$id },
                      json: { role: MemberRole.MEMBER },
                    })
                  }
                  disabled={isUpdatingMember}
                >
                  Set as Member
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="font-medium text-red-500"
                  onClick={() => handleDelete(member.$id)}
                  disabled={isDeletingMember}
                >
                  Remove {member.name}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MembersList;
