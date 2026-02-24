import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  addNewsletterSubscriber: vi.fn().mockResolvedValue({ success: true, message: "ok" }),
  getUserPreferences: vi.fn().mockResolvedValue(null),
  saveUserPreferences: vi.fn().mockResolvedValue({ success: true }),
  getAllUsers: vi.fn().mockResolvedValue([
    { id: 1, name: "Admin User", email: "admin@test.com", role: "admin", loginMethod: "manus", createdAt: new Date(), lastSignedIn: new Date() },
    { id: 2, name: "Regular User", email: "user@test.com", role: "user", loginMethod: "apple", createdAt: new Date(), lastSignedIn: new Date() },
  ]),
  updateUserRole: vi.fn().mockResolvedValue({ success: true }),
  deleteUser: vi.fn().mockResolvedValue({ success: true }),
  getAllSubscribers: vi.fn().mockResolvedValue([
    { id: 1, email: "sub1@test.com", subscribedAt: new Date(), active: 1 },
    { id: 2, email: "sub2@test.com", subscribedAt: new Date(), active: 0 },
  ]),
  removeSubscriber: vi.fn().mockResolvedValue({ success: true }),
  getSiteStats: vi.fn().mockResolvedValue({
    totalUsers: 5,
    totalSubscribers: 10,
    activeSubscribers: 7,
    adminCount: 1,
  }),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-open-id",
    email: "admin@test.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "user-open-id",
    email: "user@test.com",
    name: "Regular User",
    loginMethod: "apple",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("admin.stats", () => {
  it("returns site stats for admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const stats = await caller.admin.stats();
    expect(stats.totalUsers).toBe(5);
    expect(stats.activeSubscribers).toBe(7);
    expect(stats.adminCount).toBe(1);
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.admin.stats()).rejects.toThrow();
  });
});

describe("admin.users.list", () => {
  it("returns all users for admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const users = await caller.admin.users.list();
    expect(users).toHaveLength(2);
    expect(users[0].name).toBe("Admin User");
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.users.list()).rejects.toThrow();
  });
});

describe("admin.users.updateRole", () => {
  it("allows admin to promote a user", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.users.updateRole({ userId: 2, role: "admin" });
    expect(result.success).toBe(true);
  });

  it("prevents admin from demoting themselves", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.users.updateRole({ userId: 1, role: "user" });
    expect(result.success).toBe(false);
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.users.updateRole({ userId: 2, role: "admin" })).rejects.toThrow();
  });
});

describe("admin.users.delete", () => {
  it("allows admin to delete another user", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.users.delete({ userId: 2 });
    expect(result.success).toBe(true);
  });

  it("prevents admin from deleting themselves", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.users.delete({ userId: 1 });
    expect(result.success).toBe(false);
  });
});

describe("admin.subscribers", () => {
  it("lists all subscribers for admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const subs = await caller.admin.subscribers.list();
    expect(subs).toHaveLength(2);
  });

  it("removes a subscriber", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.subscribers.remove({ id: 1 });
    expect(result.success).toBe(true);
  });

  it("rejects non-admin users from listing", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.subscribers.list()).rejects.toThrow();
  });
});
