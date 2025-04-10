import { 
  users, 
  transactions, 
  type User, 
  type InsertUser, 
  type Transaction, 
  type InsertTransaction 
} from "@shared/schema";
import { db, sql } from "./db";
import { eq, and, desc, or, ne } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  updateUserStatus(id: number, status: 'active' | 'inactive' | 'deleted'): Promise<User | undefined>;
  updateUserBalance(id: number, amount: number): Promise<User | undefined>;
  updateUserAvatar(id: number, avatar: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  getRecentTransactions(userId: number, limit: number): Promise<Transaction[]>;
  getAllTransactions(): Promise<Transaction[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      // Convert username to lowercase for comparison
      const lowercaseUsername = username.toLowerCase();
      
      // Get all users and find the matching one with case-insensitive comparison
      const allUsers = await db.select().from(users);
      return allUsers.find(u => u.username.toLowerCase() === lowercaseUsername);
    } catch (error) {
      console.error("Error in getUserByUsername:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      // Convert email to lowercase for comparison
      const lowercaseEmail = email.toLowerCase();
      
      // Get all users and find the matching one with case-insensitive comparison
      const allUsers = await db.select().from(users);
      return allUsers.find(u => u.email.toLowerCase() === lowercaseEmail);
    } catch (error) {
      console.error("Error in getUserByEmail:", error);
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Convert any non-string fields before inserting
    const userDataForInsert = {
      ...userData,
      password: hashedPassword,
      last_login: new Date(),
      // Ensure balance is stored as string
      balance: userData.balance !== undefined ? userData.balance.toString() : "0"
    };
    
    const [user] = await db
      .insert(users)
      .values(userDataForInsert)
      .returning();
      
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }

  async updateUserStatus(id: number, status: 'active' | 'inactive' | 'deleted'): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ status })
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }

  async updateUserBalance(id: number, newBalance: number): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ balance: newBalance.toFixed(2) })
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }

  async updateUserAvatar(id: number, avatar: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ avatar })
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(ne(users.status, 'deleted'));
  }

  // Transaction operations
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    // Ensure data is in the right format
    const formattedTransaction = {
      ...transactionData,
      // Convert numeric amount to string
      amount: transactionData.amount.toString(),
      // Ensure user_id is number
      user_id: Number(transactionData.user_id),
      // Ensure created_by is number if it exists
      created_by: transactionData.created_by ? Number(transactionData.created_by) : undefined
    };
    
    const [transaction] = await db
      .insert(transactions)
      .values(formattedTransaction)
      .returning();
      
    return transaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.user_id, userId))
      .orderBy(desc(transactions.timestamp));
  }

  async getRecentTransactions(userId: number, limit: number): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.user_id, userId))
      .orderBy(desc(transactions.timestamp))
      .limit(limit);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.timestamp));
  }
}

export const storage = new DatabaseStorage();
