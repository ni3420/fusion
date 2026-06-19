import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    return await ctx.storage.generateUploadUrl();
  },
});

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const update = mutation({
  args: {
    messageId: v.id("messages"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    const currentMember = await ctx.db.get(message.memberId);
    if (!currentMember || currentMember.userId !== userId) {
      throw new Error("Unauthorized: Only the author can update attachments");
    }

    if (message.image) {
      await ctx.storage.delete(message.image);
    }

    await ctx.db.patch(args.messageId, {
      image: args.storageId,
      updatedAt: Date.now(),
    });

    return args.messageId;
  },
});