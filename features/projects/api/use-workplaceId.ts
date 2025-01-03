import { useParams } from "next/navigation";

export const useProjectId = () => {
  const params = useParams();
  const workspacesId = params?.projectId;

  return workspacesId as string;
};
