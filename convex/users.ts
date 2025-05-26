import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // For now, return a test user to get the app working
    // We'll add proper auth later
    return {
      _id: "test-user-id" as any,
      authId: "test-auth-id",
      email: "test@example.com",
      displayName: "Test User",
      timezone: "America/New_York",
      notificationsEnabled: true,
      defaultReminderTime: 24,
      reminderType: "push" as const,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  },
});

export const createUser = mutation({
  args: {
    authId: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      ...args,
      notificationsEnabled: true,
      defaultReminderTime: 24,
      reminderType: "push",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return userId;
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    timezone: v.optional(v.string()),
    notificationsEnabled: v.optional(v.boolean()),
    defaultReminderTime: v.optional(v.number()),
    reminderType: v.optional(v.union(v.literal("push"), v.literal("inApp"))),
  },
  handler: async (ctx, { userId, ...updates }) => {
    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});
