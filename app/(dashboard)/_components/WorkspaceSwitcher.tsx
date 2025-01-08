"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WorkspaceAvatar from "@/features/workspaces/_components/workspace-avatar";
import { useCreateWorkspaceModel, useGetWorkspaces } from "@/hooks/workspace";
import { useParams, useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

type Props = {};

const WorkspaceSwitcher = (props: Props) => {
  const { data } = useGetWorkspaces();
  const router = useRouter();
  const params = useParams();
  const onSelect = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`);
  };
  const { open } = useCreateWorkspaceModel();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase text-zinc-800">
          Workspaces
        </p>
        <RiAddCircleFill
          size={20}
          className="cursor-pointer text-zinc-500 transition hover:opacity-75"
          onClick={open}
        />
      </div>
      <Select
        onValueChange={onSelect}
        value={(params.workspacesId as string) || undefined}
      >
        <SelectTrigger className="my-4 w-full bg-zinc-200 p-1 font-medium">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {data &&
            "documents" in data &&
            data.documents.map((workspace) => (
              <SelectItem
                key={workspace.$id}
                value={workspace.$id}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-start gap-3 font-medium">
                  <WorkspaceAvatar
                    name={workspace.name}
                    image={workspace.imageURL}
                  />
                  <p className="truncate">{workspace.name}</p>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WorkspaceSwitcher;
