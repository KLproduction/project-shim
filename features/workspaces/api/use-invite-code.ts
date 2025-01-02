import { useParams } from "next/navigation";

export const useInviteCode = () => {
  const params = useParams();
  const workspacesId = params?.inviteCode;
  return workspacesId;
};
