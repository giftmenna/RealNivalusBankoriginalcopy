import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import bcrypt from "bcrypt";

// Define session data interface for TypeScript
declare module "express-session" {
  interface SessionData {
    userId: number;
    role: "user" | "admin";
  }
}

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: import("@shared/schema").User;
    }
  }
}
import * as schema from "@shared/schema";
import { 
  loginSchema, 
  insertUserSchema, 
  insertTransactionSchema, 
  transferSchema,
  users,
  transactions
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import crypto from "crypto";

// Use PostgreSQL for session storage with fallback
import connectPgSimple from "connect-pg-simple";
import MemoryStore from "memorystore";
import { sql, pgPool } from "./db";

const PgSessionStore = connectPgSimple(session);
const MemStore = MemoryStore(session);

// Create session store with fallback
let sessionStore: session.Store;
try {
  sessionStore = new PgSessionStore({
    pool: pgPool,
    createTableIfMissing: false,
    pruneSessionInterval: 24 * 60 * 60, // 24 hours
    errorLog: console.error
  });
  console.log("Using PostgreSQL for session storage");
} catch (error) {
  console.error("Error setting up PostgreSQL session store, using memory store as fallback", error);
  sessionStore = new MemStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
      resave: false, // Set to false with PostgreSQL store
      saveUninitialized: false, // Changed to false to prevent saving empty sessions
      cookie: {
        secure: false, // Set to false for development in Replit environment
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // Extended to 30 days for better persistence
        path: '/',
        sameSite: 'none' // Important: Change from 'lax' to 'none' for Replit iframe environment
      },
      name: 'nivalus.sid', // Custom name to avoid conflicts
      proxy: true // Trust the proxy - important for proper cookie handling
    })
  );
  
  // Enable CORS with credentials - optimized for session cookie handling
  app.use((req, res, next) => {
    // Accept all origins in development for Replit iframe environment
    const origin = req.headers.origin || '*';
    
    // Replit specific - always enable credentials for all origins in this environment
    res.header('Access-Control-Allow-Origin', origin === '*' ? '*' : origin);
    
    // Only set credentials true if origin isn't wildcard
    if (origin !== '*') {
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Expose-Headers', 'Content-Length, X-Content-Type-Options');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    next();
  });

  // SessionData interface is defined at the top of the file

  // Auth middleware - token-based approach
  const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) // Remove 'Bearer ' prefix
        : null;
      
      // Also check for token in query params (fallback for some clients)
      const queryToken = req.query.token as string | undefined;
      
      // Use either header token or query token
      const authToken = token || queryToken;
      
      // Debug auth info
      console.log("Auth check - Token:", {
        hasAuthHeader: !!authHeader,
        hasToken: !!token,
        hasQueryToken: !!queryToken,
        tokenLength: authToken ? authToken.length : 0
      });
      
      if (!authToken) {
        return res.status(401).json({ message: "Unauthorized. No authentication token provided." });
      }
      
      // Find user by token - using direct SQL query to avoid Drizzle type issues
      const result = await pgPool.query(
        'SELECT * FROM users WHERE auth_token = $1 LIMIT 1',
        [authToken]
      );
      
      if (result.rows.length === 0) {
        return res.status(401).json({ message: "Unauthorized. Invalid or expired token." });
      }
      
      const user = result.rows[0];
      
      // Store user info in request for downstream middleware and route handlers
      req.user = user;
      
      // Also set in session for backwards compatibility
      req.session.userId = user.id;
      req.session.role = user.role;
      
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(401).json({ message: "Authentication error" });
    }
  };

  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // We can just check req.user which was set by isAuthenticated
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    next();
  };

  // Check if user is active
  const isActiveUser = async (req: Request, res: Response, next: NextFunction) => {
    // req.user should already be set by isAuthenticated middleware
    const user = req.user;
    
    if (!user || user.status !== "active") {
      // For token-based auth, we can't destroy the token here
      // The client would need to discard it
      return res.status(403).json({ message: "Your account is inactive or has been deleted." });
    }
    
    next();
  };

  // Create admin user if it doesn't exist
  try {
    // Wrap this in a function to handle any database initialization issues
    const initializeAdminUser = async () => {
      try {
        const existingAdmin = await storage.getUserByUsername("admin");
        
        if (!existingAdmin) {
          await storage.createUser({
            username: "admin",
            password: "admin123", // Will be hashed in the storage.createUser method
            pin: "1234",
            email: "admin@nivalusbank.com",
            role: "admin",
            status: "active",
            balance: 1000,
          });
          
          console.log("Admin user created successfully");
        } else {
          console.log("Admin user already exists");
        }
      } catch (innerError) {
        console.error("Error checking/creating admin user:", innerError);
      }
    };
    
    // Execute after a slight delay to ensure database connection is ready
    setTimeout(initializeAdminUser, 2000);
  } catch (error) {
    console.error("Error in admin user initialization:", error);
  }

  // ======== PUBLIC ROUTES ========

  // Login route - using token-based auth
  app.post("/api/login", async (req, res) => {
    try {
      console.log("Login request:", req.body);
      const data = loginSchema.parse(req.body);
      
      // Make username lookup case-insensitive
      const username = data.username.toLowerCase();
      console.log("Looking for username (lowercase):", username);
      
      const user = await storage.getUserByUsername(username);

      console.log("User found:", user ? "yes" : "no");
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (user.status !== "active") {
        return res.status(403).json({ message: "Account is inactive or deleted" });
      }

      // Log the password received and the hashed one from DB (safe logging formats)
      console.log("Password verification:", {
        passwordReceived: !!data.password,
        passwordInDb: !!user.password,
        passwordLength: data.password.length
      });
      
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      console.log("Password valid:", isPasswordValid);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last login timestamp
      await storage.updateUser(user.id, { last_login: new Date() });

      // Generate an authentication token - using a simple approach
      // In production, use a proper JWT implementation
      const tokenData = {
        id: user.id,
        role: user.role,
        timestamp: Date.now()
      };
      
      // Create a simple token by encrypting the user data with the session secret
      const token = crypto
        .createHash('sha256')
        .update(JSON.stringify(tokenData) + (process.env.SESSION_SECRET || 'nivalus-secret-key'))
        .digest('hex');
      
      // Store token in database linked to user
      await storage.updateUser(user.id, { 
        auth_token: token,
        token_issued_at: new Date()
      });
      
      console.log("Authentication token generated for user ID:", user.id);

      // Return user object with the token
      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token // Send token to client
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Signup route
  app.post("/api/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create new user
      const newUser = await storage.createUser({
        ...userData,
        role: "user", // Force role to be user for public signup
        balance: 0
      });
      
      return res.status(201).json({ 
        message: "User created successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        }
      });
    } catch (error) {
      return res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Logout route - token-based approach
  app.post("/api/logout", isAuthenticated, async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : null;
        
      if (!token) {
        return res.status(400).json({ message: "No token provided" });
      }
      
      // Invalidate the token in the database
      await pgPool.query(
        'UPDATE users SET auth_token = NULL WHERE auth_token = $1',
        [token]
      );
      
      // Also clear the session for backward compatibility
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
        
        res.clearCookie("nivalus.sid");
        return res.status(200).json({ message: "Logged out successfully" });
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Error logging out" });
    }
  });

  // ======== USER ROUTES ========

  // Get current user
  app.get("/api/user", isAuthenticated, isActiveUser, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get recent transactions
      const recentTransactions = await storage.getRecentTransactions(user.id, 5);
      
      return res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        avatar: user.avatar,
        role: user.role,
        recentTransactions
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching user data" });
    }
  });

  // Update avatar
  app.post("/api/user/avatar", isAuthenticated, isActiveUser, async (req, res) => {
    try {
      const { avatar } = req.body;
      
      if (!avatar) {
        return res.status(400).json({ message: "Avatar is required" });
      }
      
      const updatedUser = await storage.updateUserAvatar(req.session.userId!, avatar);
      
      return res.json({ message: "Avatar updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error updating avatar" });
    }
  });

  // Transfer funds
  app.post("/api/transfer", isAuthenticated, isActiveUser, async (req, res) => {
    try {
      const transferData = transferSchema.parse(req.body);
      const sender = await storage.getUser(req.session.userId!);
      
      if (!sender) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify PIN
      if (sender.pin !== transferData.pin) {
        return res.status(400).json({ message: "Invalid PIN" });
      }
      
      // Check if sender has enough funds
      const amount = Number(transferData.amount);
      const senderBalance = Number(sender.balance);
      
      if (senderBalance < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      let recipient = null;
      let recipientInfo = null;
      
      // Only check for recipient if it's a direct transfer between Nivalus users
      if (transferData.transferMethod === 'direct') {
        // For direct transfers, we need to find the recipient
        if (transferData.recipientType === "email") {
          recipient = await storage.getUserByEmail(transferData.recipient);
        } else {
          recipient = await storage.getUserByUsername(transferData.recipient);
        }
        
        if (!recipient) {
          return res.status(404).json({ message: "Recipient not found" });
        }
        
        if (recipient.status !== "active") {
          return res.status(400).json({ message: "Recipient account is inactive or deleted" });
        }
        
        // Create recipient info JSON for direct transfer
        recipientInfo = JSON.stringify({
          email: recipient.email,
          username: recipient.username,
          memo: transferData.memo || "",
          transferMethod: "direct"
        });
        
        // Update recipient's balance
        await storage.updateUserBalance(recipient.id, Number(recipient.balance) + amount);
      } else {
        // For other transfer methods, create appropriate recipient info
        switch (transferData.transferMethod) {
          case 'wire':
            recipientInfo = JSON.stringify({
              transferMethod: "wire",
              swiftCode: transferData.additionalData?.swiftCode || "N/A",
              bankName: transferData.additionalData?.bankName || "N/A",
              accountNumber: transferData.additionalData?.accountNumber || "N/A",
              country: transferData.additionalData?.country || "N/A",
              memo: transferData.memo || ""
            });
            break;
          case 'bank':
            recipientInfo = JSON.stringify({
              transferMethod: "bank",
              routingNumber: transferData.additionalData?.routingNumber || "N/A",
              accountNumber: transferData.additionalData?.accountNumber || "N/A",
              bankName: transferData.additionalData?.bankName || "N/A",
              accountType: transferData.additionalData?.accountType || "N/A",
              memo: transferData.memo || ""
            });
            break;
          case 'card':
            recipientInfo = JSON.stringify({
              transferMethod: "card",
              cardNumber: transferData.additionalData?.cardNumber 
                ? "xxxx-xxxx-xxxx-" + transferData.additionalData.cardNumber.slice(-4) 
                : "N/A",
              cardholderName: transferData.additionalData?.cardholderName || "N/A",
              memo: transferData.memo || ""
            });
            break;
          case 'p2p':
            recipientInfo = JSON.stringify({
              transferMethod: "p2p",
              phoneNumber: transferData.additionalData?.phoneNumber || "N/A",
              platform: transferData.additionalData?.platform || "N/A",
              memo: transferData.memo || ""
            });
            break;
          default:
            recipientInfo = JSON.stringify({
              transferMethod: transferData.transferMethod,
              memo: transferData.memo || "",
              recipient: transferData.recipient || "N/A"
            });
        }
      }
      
      // Create transaction
      const transaction = await storage.createTransaction({
        user_id: sender.id,
        type: "transfer",
        amount,
        recipient_info: recipientInfo,
        timestamp: new Date(),
        created_by: sender.id
      });
      
      // Update sender's balance
      await storage.updateUserBalance(sender.id, senderBalance - amount);
      
      // Prepare response with appropriate fields
      const responseData: {
        message: string;
        transaction: {
          id: number;
          amount: number;
          timestamp: Date;
          memo: string;
          transferMethod: string;
          recipient?: string;
          recipientEmail?: string;
          recipientInfo?: any;
        };
      } = {
        message: "Transfer successful",
        transaction: {
          id: transaction.id,
          amount,
          timestamp: transaction.timestamp,
          memo: transferData.memo || "",
          transferMethod: transferData.transferMethod
        }
      };
      
      // Add recipient details if available
      if (recipient) {
        responseData.transaction.recipient = recipient.username;
        responseData.transaction.recipientEmail = recipient.email;
      } else {
        responseData.transaction.recipient = "External Recipient";
        responseData.transaction.recipientInfo = JSON.parse(recipientInfo || '{}');
      }
      
      return res.json(responseData);
    } catch (error) {
      return res.status(400).json({ message: "Invalid transfer data" });
    }
  });

  // Save receipt
  app.post("/api/transaction/:id/receipt", isAuthenticated, isActiveUser, async (req, res) => {
    try {
      const { id } = req.params;
      const { receipt } = req.body;
      
      if (!receipt) {
        return res.status(400).json({ message: "Receipt content is required" });
      }
      
      // Update transaction with receipt
      const [updatedTransaction] = await db
        .update(transactions)
        .set({ receipt })
        .where(eq(transactions.id, parseInt(id)))
        .returning();
      
      return res.json({ message: "Receipt saved successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error saving receipt" });
    }
  });

  // Get transaction history
  app.get("/api/history", isAuthenticated, isActiveUser, async (req, res) => {
    try {
      const transactions = await storage.getUserTransactions(req.session.userId!);
      return res.json(transactions);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching transaction history" });
    }
  });

  // ======== ADMIN ROUTES ========
  
  // Maintenance route to clear expired sessions
  app.post("/api/admin/maintenance/clear-sessions", isAuthenticated, isAdmin, async (req, res) => {
    try {
      // Clear expired sessions from the database using pgPool
      await pgPool.query('DELETE FROM "session" WHERE "expire" < NOW()');
      return res.json({ message: "Expired sessions cleared successfully" });
    } catch (error) {
      console.error("Error clearing sessions:", error);
      return res.status(500).json({ message: "Error clearing sessions" });
    }
  });

  // Create user (admin)
  app.post("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create new user
      const newUser = await storage.createUser(userData);
      
      return res.status(201).json({ 
        message: "User created successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          balance: newUser.balance
        }
      });
    } catch (error) {
      return res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Get all users (admin)
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      return res.json(allUsers);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Update user status (admin)
  app.put("/api/admin/users/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!["active", "inactive", "deleted"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedUser = await storage.updateUserStatus(parseInt(id), status as 'active' | 'inactive' | 'deleted');
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json({ 
        message: "User status updated successfully",
        user: updatedUser
      });
    } catch (error) {
      return res.status(500).json({ message: "Error updating user" });
    }
  });

  // Create transaction (admin)
  app.post("/api/admin/transactions", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { userId, type, amount, timestamp, recipientInfo } = req.body;
      
      // Validate data
      if (!userId || !type || !amount || !timestamp) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      if (!["deposit", "withdrawal", "transfer"].includes(type)) {
        return res.status(400).json({ message: "Invalid transaction type" });
      }
      
      // Get user
      const user = await storage.getUser(parseInt(userId));
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Create transaction
      const transaction = await storage.createTransaction({
        user_id: user.id,
        type: type as any,
        amount: parseFloat(amount),
        recipient_info: recipientInfo || null,
        timestamp: new Date(timestamp),
        created_by: req.session.userId!
      });
      
      // Update user balance
      let newBalance = Number(user.balance);
      
      if (type === "deposit") {
        newBalance += parseFloat(amount);
      } else if (type === "withdrawal" || type === "transfer") {
        // Check if user has enough funds
        if (newBalance < parseFloat(amount)) {
          return res.status(400).json({ message: "Insufficient funds" });
        }
        
        newBalance -= parseFloat(amount);
      }
      
      await storage.updateUserBalance(user.id, newBalance);
      
      return res.json({
        message: "Transaction created successfully",
        transaction
      });
    } catch (error) {
      return res.status(500).json({ message: "Error creating transaction" });
    }
  });

  // Get all transactions (admin)
  app.get("/api/admin/transactions", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const allTransactions = await storage.getAllTransactions();
      return res.json(allTransactions);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching transactions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
