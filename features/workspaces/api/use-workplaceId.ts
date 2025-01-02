import { useParams } from "next/navigation";

export const useWorkspaceId = () => {
  const params = useParams();
  const workspacesId = params?.workspacesId;

  return workspacesId as string;
};
