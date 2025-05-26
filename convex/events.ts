import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper function to calculate weekend number
function getWeekendNumber(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstSaturday = new Date(firstDay);
  
  const dayOfWeek = firstDay.getDay();
  const daysToSaturday = (6 - dayOfWeek) % 7;
  firstSaturday.setDate(firstDay.getDate() + daysToSaturday);
  
  const daysDiff = Math.floor((date.getTime() - firstSaturday.getTime()) / (1000 * 60 * 60 * 24));
  return Math.floor(daysDiff / 7) + 1;
}

export const getDashboardEvents = query({
  args: {},
  handler: async (ctx) => {
    // For now, return sample data to test the app
    // Later we'll add proper user filtering
    const events = await ctx.db.query("events").collect();
    return events;
  },
});

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("plan"), v.literal("travel")),
    startDate: v.string(),
    endDate: v.string(),
    includesSaturday: v.boolean(),
    includesSunday: v.boolean(),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    isAllDay: v.boolean(),
  },
  handler: async (ctx, args) => {
    // For now, use a test user ID
    // Later we'll get this from authentication
    const testUserId = await ctx.db.query("users").first();
    let userId;
    
    if (!testUserId) {
      // Create a test user if none exists
      userId = await ctx.db.insert("users", {
        authId: "test-auth-id",
        email: "test@example.com",
        displayName: "Test User",
        timezone: "America/New_York",
        notificationsEnabled: true,
        defaultReminderTime: 24,
        reminderType: "push",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      userId = testUserId._id;
    }
    
    const startDate = new Date(args.startDate);
    const year = startDate.getFullYear();
    const month = startDate.getMonth() + 1;
    const weekendNumber = getWeekendNumber(startDate);
    
    const eventId = await ctx.db.insert("events", {
      ...args,
      userId,
      year,
      month,
      weekendNumber,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return eventId;
  },
});

export const getMonthEvents = query({
  args: { year: v.number(), month: v.number() },
  handler: async (ctx, { year, month }) => {
    const events = await ctx.db
      .query("events")
      .filter((q) => 
        q.and(
          q.eq(q.field("year"), year),
          q.eq(q.field("month"), month)
        )
      )
      .collect();
    
    return events;
  },
});

export const deleteEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    await ctx.db.delete(eventId);
  },
});