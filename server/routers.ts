import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import {
  addNewsletterSubscriber,
  getUserPreferences,
  saveUserPreferences,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllSubscribers,
  removeSubscriber,
  getSiteStats,
} from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        return addNewsletterSubscriber(input.email);
      }),
  }),

  preferences: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const prefs = await getUserPreferences(ctx.user.id);
      return prefs || {
        theme: "light" as const,
        accentColor: "brown",
        fontSize: "medium" as const,
        showCursorTrail: 1,
      };
    }),
    save: protectedProcedure
      .input(z.object({
        theme: z.enum(["light", "dark"]).optional(),
        accentColor: z.string().max(32).optional(),
        fontSize: z.enum(["small", "medium", "large"]).optional(),
        showCursorTrail: z.number().min(0).max(1).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return saveUserPreferences(ctx.user.id, input);
      }),
  }),

  admin: router({
    stats: adminProcedure.query(async () => {
      return getSiteStats();
    }),
    users: router({
      list: adminProcedure.query(async () => {
        return getAllUsers();
      }),
      updateRole: adminProcedure
        .input(z.object({
          userId: z.number(),
          role: z.enum(["user", "admin"]),
        }))
        .mutation(async ({ input, ctx }) => {
          // Prevent admin from demoting themselves
          if (input.userId === ctx.user.id && input.role === "user") {
            return { success: false, message: "you can't remove your own admin access" };
          }
          return updateUserRole(input.userId, input.role);
        }),
      delete: adminProcedure
        .input(z.object({ userId: z.number() }))
        .mutation(async ({ input, ctx }) => {
          // Prevent admin from deleting themselves
          if (input.userId === ctx.user.id) {
            return { success: false, message: "you can't delete your own account from here" };
          }
          return deleteUser(input.userId);
        }),
    }),
    subscribers: router({
      list: adminProcedure.query(async () => {
        return getAllSubscribers();
      }),
      remove: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return removeSubscriber(input.id);
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
