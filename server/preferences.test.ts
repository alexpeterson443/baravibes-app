import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  addNewsletterSubscriber: vi.fn().mockResolvedValue({
    success: true,
    message: "subscribed successfully",
  }),
  getUserPreferences: vi.fn().mockResolvedValue({
    id: 1,
    userId: 1,
    theme: "dark",
    accentColor: "green",
    fontSize: "large",
    showCursorTrail: 0,
    updatedAt: new Date(),
  }),
  saveUserPreferences: vi.fn().mockResolvedValue({ success: true }),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-prefs",
    email: "capyfan@example.com",
    name: "Capy Fan",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("preferences.get", () => {
  it("returns saved preferences for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.preferences.get();

    expect(result).toBeDefined();
    expect(result.theme).toBe("dark");
    expect(result.accentColor).toBe("green");
    expect(result.fontSize).toBe("large");
    expect(result.showCursorTrail).toBe(0);
  });

  it("rejects unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.preferences.get()).rejects.toThrow();
  });
});

describe("preferences.save", () => {
  it("saves preferences for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.preferences.save({
      theme: "dark",
      accentColor: "blue",
      fontSize: "large",
      showCursorTrail: 0,
    });

    expect(result).toEqual({ success: true });
  });

  it("accepts partial preference updates", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.preferences.save({
      theme: "light",
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.preferences.save({ theme: "dark" })
    ).rejects.toThrow();
  });

  it("rejects invalid theme values", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.preferences.save({ theme: "neon" as any })
    ).rejects.toThrow();
  });

  it("rejects invalid fontSize values", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.preferences.save({ fontSize: "huge" as any })
    ).rejects.toThrow();
  });
});
