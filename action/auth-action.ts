import { AUTH_COOKIE } from "@/features/auth/constants";
import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";

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
