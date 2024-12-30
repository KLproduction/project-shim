import "server-only";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import {
  Account,
  Client,
  Databases,
  Storage,
  Models,
  type Account as AccountType,
  type Databases as DatabasesType,
  type Storage as StorageType,
  type Users as UsersType,
} from "node-appwrite";
import { AUTH_COOKIE } from "@/features/auth/constants";

type AdditionContext = {
  Variables: {
    account: AccountType;
    storage: StorageType;
    databases: DatabasesType;
    users: UsersType;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<AdditionContext>(
  async (c, next) => {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string);

    const session = getCookie(c, AUTH_COOKIE);
    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    client.setSession(session);

    const account = new Account(client);
    const storage = new Storage(client);
    const databases = new Databases(client);

    const user = await account.get();

    c.set("account", account);
    c.set("storage", storage);
    c.set("databases", databases);
    c.set("user", user);

    await next();
  },
);
