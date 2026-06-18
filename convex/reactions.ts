import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { auth } from "./auth";

export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    value: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Unauthorized");

    const existingReaction = await ctx.db
      .query("reactions")
      .withIndex("by_message_id_member_id_value", (q) =>
        q
          .eq("messageId", args.messageId)
          .eq("memberId", member._id)
          .eq("value", args.value)
      )
      .unique();

    if (existingReaction) {
      await ctx.db.delete(existingReaction._id);
      return { _id: existingReaction._id, deleted: true };
    }

    const reactionId = await ctx.db.insert("reactions", {
      value: args.value,
      messageId: args.messageId,
      memberId: member._id,
      workspaceId: args.workspaceId,
    });

    return { _id: reactionId, deleted: false };
  },
});