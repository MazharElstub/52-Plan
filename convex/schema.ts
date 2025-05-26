import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    authId: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    timezone: v.string(),
    notificationsEnabled: v.boolean(),
    defaultReminderTime: v.number(),
    reminderType: v.union(v.literal("push"), v.literal("inApp")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_auth_id", ["authId"])
    .index("by_email", ["email"]),

  events: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("plan"), v.literal("travel")),
    year: v.number(),
    month: v.number(),
    weekendNumber: v.number(),
    includesSaturday: v.boolean(),
    includesSunday: v.boolean(),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    isAllDay: v.boolean(),
    startDate: v.string(),
    endDate: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_year", ["userId", "year"])
    .index("by_user_year_month", ["userId", "year", "month"]),
});