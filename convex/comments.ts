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

const populateFullComment = async (ctx: QueryCtx, comment: Doc<"comments">) => {
  const member = await populateMember(ctx, comment.memberId);
  return {
    ...comment,
    member,
  };
};

export const create = mutation({
  args: {
    body: v.string(),
    messageId: v.id("messages"),
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

    const commentId = await ctx.db.insert("comments", {
      body: args.body,
      messageId: args.messageId,
      memberId: member._id,
      workspaceId: args.workspaceId,
    });

    return commentId;
  },
});

export const get = query({
  args: {
    messageId: v.id("messages"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const results = await ctx.db
      .query("comments")
      .withIndex("by_message_id", (q) => q.eq("messageId", args.messageId))
      .order("asc")
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      results.page.map((comment) => populateFullComment(ctx, comment))
    );

    return {
      ...results,
      page: page.filter(Boolean),
    };
  },
});

export const update = mutation({
  args: {
    id: v.id("comments"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const comment = await ctx.db.get(args.id);
    if (!comment) throw new Error("Comment not found");

    const currentMember = await ctx.db.get(comment.memberId);
    if (!currentMember || currentMember.userId !== userId) {
      throw new Error("Unauthorized: Only the author can modify this comment");
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
    id: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const comment = await ctx.db.get(args.id);
    if (!comment) throw new Error("Comment not found");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", comment.workspaceId).eq("userId", userId)
      )
      .unique();

    const isAuthor = currentMember?._id === comment.memberId;
    const isAdmin = currentMember?.role === "admin";

    if (!isAuthor && !isAdmin) {
      throw new Error("Unauthorized to delete this comment");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});