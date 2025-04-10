import { pgTable, text, serial, decimal, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'deleted']);
export const transactionTypeEnum = pgEnum('transaction_type', ['deposit', 'withdrawal', 'transfer']);

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  pin: varchar("pin", { length: 4 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  balance: decimal("balance", { precision: 15, scale: 2 }).default("0.00").notNull(),
  role: userRoleEnum("role").default("user").notNull(),
  status: userStatusEnum("status").default("active").notNull(),
  last_login: timestamp("last_login"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  avatar: text("avatar"),
  auth_token: varchar("auth_token", { length: 255 }),
  token_issued_at: timestamp("token_issued_at")
});

// Transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id").references(() => users.id).notNull(),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  recipient_info: text("recipient_info"),
  timestamp: timestamp("timestamp").notNull(),
  created_by: serial("created_by").references(() => users.id),
  receipt: text("receipt")
});

// Zod schemas for form validation and data insertion
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  pin: z.string().length(4).regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
  email: z.string().email(),
  balance: z.coerce.number().min(0).optional(),
  avatar: z.string().nullable().optional(),
  role: z.enum(["user", "admin"]).default("user"),
  status: z.enum(["active", "inactive", "deleted"]).default("active"),
}).omit({ id: true, created_at: true, last_login: true });

export const insertTransactionSchema = createInsertSchema(transactions, {
  amount: z.coerce.number().positive(),
  type: z.enum(["deposit", "withdrawal", "transfer"]),
  recipient_info: z.string().optional(),
  receipt: z.string().optional(),
}).omit({ id: true });

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Transfer schema
export const transferSchema = z.object({
  recipient: z.string().min(3, "Enter a valid email or username"),
  recipientType: z.enum(["email", "username"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  memo: z.string().optional(),
  pin: z.string().length(4, "PIN must be exactly 4 digits"),
  transferMethod: z.enum(["direct", "wire", "bank", "card", "p2p"]).default("direct"),
  additionalData: z.record(z.string(), z.any()).optional()
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type TransferData = z.infer<typeof transferSchema>;
