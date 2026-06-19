import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const getThreadReplies = query({
  args: {
    parentMessageId: v.id("messages"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return [];

    const replies = await ctx.db
      .query("messages")
      .withIndex("by_parent_message_id", (q) => 
        q.eq("parentMessageId", args.parentMessageId)
      )
      .order("asc")
      .collect();

    return replies;
  },
});

export const getThreadMeta = query({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const replies = await ctx.db
      .query("messages")
      .withIndex("by_parent_message_id", (q) => 
        q.eq("parentMessageId", args.messageId)
      )
      .collect();

    if (replies.length === 0) {
      return { count: 0, lastReplyTimestamp: null };
    }

    const lastReply = replies[replies.length - 1];

    return {
      count: replies.length,
      lastReplyTimestamp: lastReply._creationTime,
    };
  },
});

export const createThreadReply = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.string()),
    gifUrl: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.id("messages"),
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

    const messageId = await ctx.db.insert("messages", {
      body: args.body,
      image: args.image,
      gifUrl: args.gifUrl,
      memberId: member._id,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      parentMessageId: args.parentMessageId,
    });

    return messageId;
  },
});