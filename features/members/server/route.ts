import { getMember } from "@/action/auth-action";
import { DATABASE_ID, MEMBER_ID } from "@/config";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { da, de } from "date-fns/locale";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { z } from "zod";
import { MemberRole } from "../types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      }),
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");
      const member = getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const members = await databases.listDocuments(DATABASE_ID, MEMBER_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);
      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
            role: member.role,
            userId: member.userId,
          };
        }),
      );
      return c.json({ ...members, documents: populatedMembers });
    },
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBER_ID,
      memberId,
    );
    const allMembersInWorkplace = await databases.listDocuments(
      DATABASE_ID,
      MEMBER_ID,
      [Query.equal("workspaceId", memberToDelete.workspaceId)],
    );

    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });
    if (!member.member) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    if (
      member.member.$id !== memberToDelete.$id &&
      member.member.role !== MemberRole.ADMIN
    ) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    if (allMembersInWorkplace.total === 1) {
      return c.json({ error: "Cannot delete last member" }, 400);
    }
    await databases.deleteDocument(DATABASE_ID, MEMBER_ID, memberId);
    return c.json({
      data: {
        $id: memberToDelete.$id,
      },
    });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        role: z.nativeEnum(MemberRole),
      }),
    ),
    async (c) => {
      const { memberId } = c.req.param();
      const user = c.get("user");
      const databases = c.get("databases");
      const role = c.req.valid("json").role;

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBER_ID,
        memberId,
      );
      const allMembersInWorkplace = await databases.listDocuments(
        DATABASE_ID,
        MEMBER_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)],
      );

      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });
      if (!member.member) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      if (member.member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      if (allMembersInWorkplace.total === 1) {
        return c.json({ error: "Cannot downgrade last member" }, 400);
      }

      const adminCount = allMembersInWorkplace.documents.filter(
        (m) => m.role === MemberRole.ADMIN,
      ).length;

      if (
        memberToUpdate.role === MemberRole.ADMIN &&
        adminCount === 1 &&
        role !== MemberRole.ADMIN
      ) {
        return c.json({ error: "Cannot downgrade last admin" }, 400);
      }

      await databases.updateDocument(DATABASE_ID, MEMBER_ID, memberId, {
        role,
      });
      return c.json({
        data: {
          $id: memberToUpdate.$id,
        },
      });
    },
  );

export default app;
