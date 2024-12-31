"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WorkspaceAvatar from "@/features/workspaces/_components/workspace-avatar";
import { useGetWorkspaces } from "@/hooks/workspace";
import { RiAddCircleFill } from "react-icons/ri";

type Props = {};

const WorkspaceSwitcher = (props: Props) => {
  const { data } = useGetWorkspaces();
  const workspaces = JSON.stringify(data);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase text-zinc-800">
          Workspaces
        </p>
        <RiAddCircleFill
          size={20}
          className="cursor-pointer text-zinc-500 transition hover:opacity-75"
        />
      </div>
      <Select>
        <SelectTrigger className="w-full bg-zinc-200 p-1 font-medium">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {data?.documents.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
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
