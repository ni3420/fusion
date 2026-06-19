import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const getOrCreate = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMember) throw new Error("Unauthorized");

    const existingConversation = await ctx.db
      .query("conversations")
      .withIndex("by_workspace_id_members", (q) =>
        q
          .eq("workspaceId", args.workspaceId)
          .eq("memberOneId", currentMember._id)
          .eq("memberTwoId", args.memberId)
      )
      .unique();

    const existingConversationInverse = await ctx.db
      .query("conversations")
      .withIndex("by_workspace_id_members", (q) =>
        q
          .eq("workspaceId", args.workspaceId)
          .eq("memberOneId", args.memberId)
          .eq("memberTwoId", currentMember._id)
      )
      .unique();

    const conversation = existingConversation || existingConversationInverse;

    if (conversation) {
      return conversation._id;
    }

    const conversationId = await ctx.db.insert("conversations", {
      workspaceId: args.workspaceId,
      memberOneId: currentMember._id,
      memberTwoId: args.memberId,
    });

    return conversationId;
  },
});