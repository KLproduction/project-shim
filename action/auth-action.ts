import { DATABASE_ID, MEMBER_ID, WORKSPACES_ID } from "@/config";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";

export const getCurrent = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string);

    const session = (await cookies()).get(AUTH_COOKIE);
    if (session) {
      client.setSession(session.value);
      const account = new Account(client);
      return {
        status: 200,
        account,
      };
    }
    return {
      status: 404,
    };
  } catch (e) {
    return null;
  }
};
export const getWorkspace = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string);

    const session = (await cookies()).get(AUTH_COOKIE);
    if (session) {
      client.setSession(session.value);
      const account = new Account(client);
      const user = await account.get();
      const databases = new Databases(client);
      const members = await databases.listDocuments(DATABASE_ID, MEMBER_ID, [
        Query.equal("userId", user.$id),
      ]);

      // if (members.total === 0) {
      //   return c.json({ data: [], total: 0 });
      // }

      const workspaceIds = members.documents.map(
        (member) => member.workspaceId,
      );

      const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACES_ID,
        [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)],
      );
      return {
        status: 200,
        workspaces,
      };
    }
    return {
      status: 404,
    };
  } catch (e) {
    return null;
  }
};

type GetMemberProps = {
  databases: Databases;
  workspaceId: string;
  userId: string;
};
export const getMember = async ({
  databases,
  workspaceId,
  userId,
}: GetMemberProps) => {
  const members = await databases.listDocuments(DATABASE_ID, MEMBER_ID, [
    Query.equal("workspaceId", workspaceId),
    Query.equal("userId", userId),
  ]);

  const member = members.documents[0];
  return {
    status: 200,
    member,
  };
};
