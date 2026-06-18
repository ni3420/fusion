import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
  const user = await ctx.db.get(userId);
  if (!user) return null;
  return {
    name: user.name,
    image: user.image,
    email: user.email,
  };
};

const populateMember = async (ctx: QueryCtx, memberId: Id<"members">) => {
  const member = await ctx.db.get(memberId);
  if (!member) return null;

  const user = await populateUser(ctx, member.userId);
  return {
    ...member,
    user,
  };
};

const populateReactions = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const reactions = await ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();

  const countMap = reactions.reduce((acc, rx) => {
    acc[rx.value] = (acc[rx.value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return reactions.map((rx) => ({
    ...rx,
    count: countMap[rx.value],
  }));
};

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const replies = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", messageId))
    .collect();

  if (replies.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: undefined,
    };
  }

  const lastReply = replies[replies.length - 1];
  const lastReplyMember = await ctx.db.get(lastReply.memberId);
  const lastReplyUser = lastReplyMember ? await ctx.db.get(lastReplyMember.userId) : null;

  return {
    count: replies.length,
    image: lastReplyUser?.image,
    timestamp: lastReply._creationTime,
  };
};

const populateFullMessage = async (ctx: QueryCtx, message: Doc<"messages">) => {
  const [member, reactions, thread] = await Promise.all([
    populateMember(ctx, message.memberId),
    populateReactions(ctx, message._id),
    populateThread(ctx, message._id),
  ]);

  return {
    ...message,
    member,
    reactions,
    threadCount: thread.count,
    threadImage: thread.image,
    threadTimestamp: thread.timestamp,
  };
};

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.string()),
    gifUrl: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
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

export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    let results;

    if (args.parentMessageId) {
      results = await ctx.db
        .query("messages")
        .withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", args.parentMessageId))
        .order("desc")
        .paginate(args.paginationOpts);
    } else if (args.channelId) {
      results = await ctx.db
        .query("messages")
        .withIndex("by_channel_id", (q) => q.eq("channelId", args.channelId))
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      throw new Error("Missing query context filter requirements");
    }

    const page = await Promise.all(
      results.page.map((msg) => populateFullMessage(ctx, msg))
    );

    return {
      ...results,
      page: page.filter(Boolean),
    };
  },
});

export const update = mutation({
  args: {
    id: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.id);
    if (!message) throw new Error("Message context not resolved");

    const currentMember = await ctx.db.get(message.memberId);
    if (!currentMember || currentMember.userId !== userId) {
      throw new Error("Unauthorized: Only the author can modify this stream node");
    }

    await ctx.db.patch(args.id, {
      body: args.body,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.id);
    if (!message) throw new Error("Message not found");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", message.workspaceId).eq("userId", userId)
      )
      .unique();

    const isAuthor = currentMember?._id === message.memberId;
    const isAdmin = currentMember?.role === "admin";

    if (!isAuthor && !isAdmin) {
      throw new Error("Unauthorized to purge message parameters");
    }

    const replies = await ctx.db
      .query("messages")
      .withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", args.id))
      .collect();

    await Promise.all(replies.map((reply) => ctx.db.delete(reply._id)));
    await ctx.db.delete(args.id);

    return args.id;
  },
});