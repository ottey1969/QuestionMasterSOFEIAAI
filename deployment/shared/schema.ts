import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  credits: integer("credits").default(5),
  isAdmin: boolean("is_admin").default(false),
  ipAddress: varchar("ip_address"),
  fingerprint: varchar("fingerprint"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  type: varchar("type").notNull(), // 'earned', 'spent', 'purchased', 'admin_granted'
  description: text("description"),
  serviceType: varchar("service_type"), // 'general', 'seo', 'grant'
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiRequests = pgTable("ai_requests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  serviceType: varchar("service_type").notNull(),
  prompt: text("prompt").notNull(),
  response: text("response"),
  creditsUsed: integer("credits_used").notNull(),
  status: varchar("status").default('completed'), // 'pending', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  message: text("message").notNull(),
  isFromUser: boolean("is_from_user").notNull(),
  isFromAdmin: boolean("is_from_admin").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const securityLogs = pgTable("security_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  ipAddress: varchar("ip_address").notNull(),
  userAgent: text("user_agent"),
  action: varchar("action").notNull(),
  details: jsonb("details"),
  riskLevel: varchar("risk_level").default('low'), // 'low', 'medium', 'high'
  timestamp: timestamp("timestamp").defaultNow(),
});

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// IP Credits table for anonymous users
export const ipCredits = pgTable("ip_credits", {
  id: varchar("id").primaryKey().notNull(),
  ipAddress: varchar("ip_address").notNull().unique(),
  email: varchar("email"), // Optional email for tracking/contact
  credits: integer("credits").default(5).notNull(),
  isUnlimited: boolean("is_unlimited").default(false).notNull(),
  lastUsed: timestamp("last_used").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type IpCredit = typeof ipCredits.$inferSelect;
export type InsertIpCredit = typeof ipCredits.$inferInsert;

export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;
export type CreditTransaction = typeof creditTransactions.$inferSelect;

export type InsertAIRequest = typeof aiRequests.$inferInsert;
export type AIRequest = typeof aiRequests.$inferSelect;

export type InsertChatMessage = typeof chatMessages.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertSecurityLog = typeof securityLogs.$inferInsert;
export type SecurityLog = typeof securityLogs.$inferSelect;

// Insert schemas
export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertAIRequestSchema = createInsertSchema(aiRequests).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({
  id: true,
  timestamp: true,
});
