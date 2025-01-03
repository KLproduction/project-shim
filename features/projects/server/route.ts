import { getMember } from "@/action/auth-action";
import {
  BUCKET_IMAGE_ID,
  DATABASE_ID,
  MEMBER_ID,
  PROJECT_ID,
  WORKSPACES_ID,
} from "@/config";
import { MemberRole } from "@/features/members/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCode } from "@/lib/utils";
import { createProjectSchema, updateProjectSchema } from "@/schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { workspaceId } = c.req.valid("query");

      if (!workspaceId) {
        return c.json({ error: "Missing workspaceId" }, 400);
      }

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments(DATABASE_ID, PROJECT_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);
      return c.json({ data: projects });
    },
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image, workspaceId } = c.req.valid("form");

      const { member } = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          BUCKET_IMAGE_ID,
          ID.unique(),
          image,
        );
        const arrayBuffer = await storage.getFileView(
          BUCKET_IMAGE_ID,
          file.$id,
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECT_ID,
        ID.unique(),
        {
          name,
          imageURL: uploadedImageUrl,
          workspaceId,
        },
      );

      return c.json({ data: project });
    },
  )
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const existingProject = await databases.getDocument(
        DATABASE_ID,
        PROJECT_ID,
        projectId,
      );

      const { member } = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json(
          { error: "Unauthorized, not the member of the workspace" },
          401,
        );
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
        if (!allowedTypes.includes(image.type)) {
          return c.json(
            {
              error:
                "Invalid file type. Only JPG, PNG, JPEG, and SVG are allowed",
            },
            400,
          );
        }
        if (image.size > 1048576) {
          return c.json({ error: "File size exceeds 1 MB limit" }, 400);
        }

        const file = await storage.createFile(
          BUCKET_IMAGE_ID,
          ID.unique(),
          image,
        );
        const arrayBuffer = await storage.getFileView(
          BUCKET_IMAGE_ID,
          file.$id,
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
      } else {
        uploadedImageUrl = image;
      }

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECT_ID,
        projectId,
        {
          name,
          imageURL: uploadedImageUrl,
        },
      );
      return c.json({ data: project });
    },
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { projectId } = c.req.param();

    const existingProject = await databases.getDocument(
      DATABASE_ID,
      PROJECT_ID,
      projectId,
    );
    if (!existingProject) {
      return c.json({ error: "Project not found" }, 404);
    }
    const workspaceId = existingProject.workspaceId;

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member?.member?.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    await databases.deleteDocument(
      DATABASE_ID,
      PROJECT_ID,
      existingProject.$id,
    );
    return c.json({ data: { $id: existingProject.$id } });
  });

export default app;
