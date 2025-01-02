"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Workspace } from "../type";
import DottedSeparator from "@/components/global/DottedSeparator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useJoinWorkspace } from "@/hooks/workspace";
import { useInviteCode } from "../api/use-invite-code";

type Props = {
  initialValues: {
    name: string;
    inviteCode: string;
    workspaceId: string;
  };
};
const JoinWorkspaceForm = ({ initialValues }: Props) => {
  const { joinWorkspaceMutate, isJoiningWorkspace } = useJoinWorkspace();

  const onSubmit = () =>
    joinWorkspaceMutate({
      param: { workspaceId: initialValues.workspaceId },
      json: { code: initialValues.inviteCode },
    });
  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          {`You've been invite to join `} <strong>{initialValues.name}</strong>
          {` workspace.`}
        </CardDescription>
      </CardHeader>

      <DottedSeparator className="p-7" />
      <CardContent className="p-7">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <Button
            variant={"outline"}
            className="w-full md:w-fit"
            type="button"
            size={"lg"}
            asChild
          >
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button
            className="w-full md:w-fit"
            size={"lg"}
            onClick={onSubmit}
            disabled={isJoiningWorkspace}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinWorkspaceForm;
