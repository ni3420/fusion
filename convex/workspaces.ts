import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

const generateCode = () => {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  const code = Array.from({ length: 6 }, () => {
    return characters[Math.floor(Math.random() * characters.length)];
  }).join("");
  
  return code.toUpperCase();
};

export const create = mutation({
  args: {
    name: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const joinCode = generateCode();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const workspace = await ctx.db.insert("workspaces", {
      name: args.name,
      joinCode,
      userId,
    });

    await ctx.db.insert("members", {
      userId,
      workspaceId: workspace,
      role: "admin"
    });

    await ctx.db.insert("channels", {
      workspaceId: workspace,
      name: "general",
      userId
    });

    return workspace;
  }
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((member) => member.workspaceId);
    const workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  },
});

export const getId = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();

    if (!member) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
      .collect();

    for (const memberDoc of members) {
      await ctx.db.delete(memberDoc._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const getInfoById = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    const workspace = await ctx.db.get(args.workspaceId);

    if (!workspace) {
      return null;
    }

    return {
      name: workspace.name,
      isMember: !!member,
    };
  },
});

export const resetJoinCode = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const newJoinCode = generateCode();

    await ctx.db.patch(args.workspaceId, {
      joinCode: newJoinCode,
    });

    return args.workspaceId;
  },
});

export const joinWorkspace = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    joinCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    if (workspace.joinCode.toLowerCase() !== args.joinCode.toLowerCase()) {
      throw new Error("Invalid access token code string");
    }

    const existingMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (existingMember) {
      return args.workspaceId;
    }

    await ctx.db.insert("members", {
      userId,
      workspaceId: args.workspaceId,
      role: "member",
    });

    return args.workspaceId;
  },
});