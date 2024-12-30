import "server-only";

import {
  Client,
  Account,
  Storage,
  Users,
  Databases,
  OAuthProvider,
} from "node-appwrite";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string)
    .setKey(process.env.NEXT_APPWRITE_KEY as string);

  return {
    get account() {
      return new Account(client);
    },
  };
}
