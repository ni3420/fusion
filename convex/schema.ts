import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  ...authTables,
  workspaces:defineTable({
    name:v.string(),
    userId:v.id("users"),
    joinCode:v.string()
  }),

  members:defineTable({

    userId:v.id("users"),
    workspaceId:v.id("workspaces"),
    role:v.union(v.literal("admin"),v.literal("member"))
  })
  .index("by_user_id",["userId"])
  .index("by_workspace_id",["workspaceId"])
  .index("by_workspace_id_user_id",["workspaceId","userId"]),

  channels:defineTable({
    name:v.string(),
    workspaceId:v.id("workspaces"),
    userId:v.id("users")
  })
  .index("by_workspace_id",["workspaceId"]),
  
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.union(v.id("_storage"), v.string())),
    gifUrl: v.optional(v.string()),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_channel_id", ["channelId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_member_id", ["memberId"]),
    conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_members", ["workspaceId", "memberOneId", "memberTwoId"]),
   comments: defineTable({
    body: v.string(),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    updatedAt: v.optional(v.number()),
  })
    .index("by_message_id", ["messageId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"]),

  reactions: defineTable({
    value: v.string(),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
  })
    .index("by_message_id", ["messageId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
    .index("by_message_id_member_id_value", ["messageId", "memberId", "value"]),
threads: defineTable({
    parentMessageId: v.id("messages"),
    workspaceId: v.id("workspaces"),
    channelId: v.id("channels"),
    replyCount: v.number(),
    lastReplyAt: v.optional(v.number()),
  })
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_parent_message", ["workspaceId", "parentMessageId"]),


  // Your other tables...
});
 
export default schema;