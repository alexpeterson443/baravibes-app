import { eq, sql, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, newsletterSubscribers, userPreferences } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Newsletter subscriber helpers
export async function addNewsletterSubscriber(email: string): Promise<{ success: boolean; message: string }> {
  const db = await getDb();
  if (!db) {
    return { success: false, message: "database not available" };
  }
  try {
    await db.insert(newsletterSubscribers).values({ email }).onDuplicateKeyUpdate({
      set: { active: 1 },
    });
    return { success: true, message: "subscribed successfully" };
  } catch (error) {
    console.error("[Database] Failed to add newsletter subscriber:", error);
    return { success: false, message: "failed to subscribe" };
  }
}

export async function getActiveSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.active, 1));
}

// User preferences helpers
export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function saveUserPreferences(userId: number, prefs: {
  theme?: "light" | "dark";
  accentColor?: string;
  fontSize?: "small" | "medium" | "large";
  showCursorTrail?: number;
}) {
  const db = await getDb();
  if (!db) return { success: false };
  try {
    await db.insert(userPreferences).values({
      userId,
      ...prefs,
    }).onDuplicateKeyUpdate({
      set: {
        ...prefs,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to save user preferences:", error);
    return { success: false };
  }
}

// Admin helpers
export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    loginMethod: users.loginMethod,
    createdAt: users.createdAt,
    lastSignedIn: users.lastSignedIn,
  }).from(users);
}

export async function updateUserRole(userId: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) return { success: false };
  try {
    await db.update(users).set({ role }).where(eq(users.id, userId));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to update user role:", error);
    return { success: false };
  }
}

export async function deleteUser(userId: number) {
  const db = await getDb();
  if (!db) return { success: false };
  try {
    // Delete preferences first
    await db.delete(userPreferences).where(eq(userPreferences.userId, userId));
    // Delete user
    await db.delete(users).where(eq(users.id, userId));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to delete user:", error);
    return { success: false };
  }
}

export async function getAllSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterSubscribers);
}

export async function removeSubscriber(id: number) {
  const db = await getDb();
  if (!db) return { success: false };
  try {
    await db.update(newsletterSubscribers).set({ active: 0 }).where(eq(newsletterSubscribers.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to remove subscriber:", error);
    return { success: false };
  }
}

export async function getSiteStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, totalSubscribers: 0, activeSubscribers: 0, adminCount: 0 };
  
  const [userCount] = await db.select({ value: count() }).from(users);
  const [subCount] = await db.select({ value: count() }).from(newsletterSubscribers);
  const [activeSubCount] = await db.select({ value: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.active, 1));
  const [admins] = await db.select({ value: count() }).from(users).where(eq(users.role, "admin"));
  
  return {
    totalUsers: userCount?.value ?? 0,
    totalSubscribers: subCount?.value ?? 0,
    activeSubscribers: activeSubCount?.value ?? 0,
    adminCount: admins?.value ?? 0,
  };
}
