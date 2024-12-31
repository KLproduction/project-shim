import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/features/auth/server/route";
import workspaces from "@/features/workspaces/server/route";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", auth).route("/workspaces", workspaces);

interface RouteContextWithParams {
  params?: Record<string, string | undefined>;
}

export const GET = handle(app as any);
export const POST = handle(app as any);

export type AppType = typeof routes;
