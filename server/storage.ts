import {
  users,
  creditTransactions,
  aiRequests,
  chatMessages,
  securityLogs,
  type User,
  type UpsertUser,
  type InsertCreditTransaction,
  type CreditTransaction,
  type InsertAIRequest,
  type AIRequest,
  type InsertChatMessage,
  type ChatMessage,
  type InsertSecurityLog,
  type SecurityLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserCredits(userId: string, credits: number): Promise<void>;
  updateUserSecurity(userId: string, ipAddress: string, fingerprint: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  
  // Credit operations
  addCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction>;
  getUserCreditTransactions(userId: string): Promise<CreditTransaction[]>;
  
  // AI request operations
  createAIRequest(request: InsertAIRequest): Promise<AIRequest>;
  getUserAIRequests(userId: string): Promise<AIRequest[]>;
  
  // Chat operations
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(userId?: string): Promise<ChatMessage[]>;
  
  // Security operations
  addSecurityLog(log: InsertSecurityLog): Promise<SecurityLog>;
  getSecurityLogs(): Promise<SecurityLog[]>;
  getFlaggedIPs(): Promise<{ ipAddress: string; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserCredits(userId: string, credits: number): Promise<void> {
    await db
      .update(users)
      .set({ credits, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async updateUserSecurity(userId: string, ipAddress: string, fingerprint: string): Promise<void> {
    await db
      .update(users)
      .set({ ipAddress, fingerprint, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Credit operations
  async addCreditTransaction(transaction: InsertCreditTransaction): Promise<CreditTransaction> {
    const [result] = await db
      .insert(creditTransactions)
      .values(transaction)
      .returning();
    return result;
  }

  async getUserCreditTransactions(userId: string): Promise<CreditTransaction[]> {
    return await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt));
  }

  // AI request operations
  async createAIRequest(request: InsertAIRequest): Promise<AIRequest> {
    const [result] = await db
      .insert(aiRequests)
      .values(request)
      .returning();
    return result;
  }

  async getUserAIRequests(userId: string): Promise<AIRequest[]> {
    return await db
      .select()
      .from(aiRequests)
      .where(eq(aiRequests.userId, userId))
      .orderBy(desc(aiRequests.createdAt));
  }

  // Chat operations
  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [result] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return result;
  }

  async getChatMessages(userId?: string): Promise<ChatMessage[]> {
    const query = db
      .select()
      .from(chatMessages)
      .orderBy(desc(chatMessages.timestamp));
    
    if (userId) {
      return await query.where(eq(chatMessages.userId, userId));
    }
    
    return await query;
  }

  // Security operations
  async addSecurityLog(log: InsertSecurityLog): Promise<SecurityLog> {
    const [result] = await db
      .insert(securityLogs)
      .values(log)
      .returning();
    return result;
  }

  async getSecurityLogs(): Promise<SecurityLog[]> {
    return await db
      .select()
      .from(securityLogs)
      .orderBy(desc(securityLogs.timestamp));
  }

  async getFlaggedIPs(): Promise<{ ipAddress: string; count: number }[]> {
    return await db
      .select({
        ipAddress: securityLogs.ipAddress,
        count: sql<number>`count(*)::int`
      })
      .from(securityLogs)
      .where(eq(securityLogs.riskLevel, 'high'))
      .groupBy(securityLogs.ipAddress)
      .orderBy(desc(sql`count(*)`));
  }
}

export const storage = new DatabaseStorage();
