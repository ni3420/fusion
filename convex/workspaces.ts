import { v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { auth } from "./auth";

const generateCode = () => {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  const code = Array.from({ length: 6 }, () => {
    return characters[Math.floor(Math.random() * characters.length)];
  }).join("");
  
  return code.toUpperCase();
};

export const create=mutation({
    args:{
        name:v.string()
    },
    handler:async(ctx,args)=>{
        const userId=await auth.getUserId(ctx)
        const joinCode=generateCode()
        if(!userId)
        {
            throw new Error
        }
        const workspace=await ctx.db.insert("workspaces",{
            name:args.name,
            joinCode,
            userId,
        })

        await ctx.db.insert("members",{
            userId,
            workspaceId:workspace,
            role:"admin"
        })
        return workspace
    }
})
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

export const getId=query({
    args:{id:v.id("workspaces")},
    handler:async(ctx,args)=>{
        const userId=await auth.getUserId(ctx)
        if(!userId)
        {
            throw new Error("unauthorized")
        }
        return await ctx.db.get(args.id)

    },
});