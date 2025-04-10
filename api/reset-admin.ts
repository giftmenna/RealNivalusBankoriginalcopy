import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

// This script resets the admin user's password to 'admin123'
async function resetAdminPassword() {
  try {
    console.log("Resetting admin password...");
    
    // Get the admin user
    const [admin] = await db.select().from(users).where(eq(users.username, "admin"));
    
    if (!admin) {
      console.log("Admin user not found. Please make sure the admin user exists.");
      return;
    }
    
    console.log("Found admin user:", admin.username);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash("admin123", 10);
    console.log("Generated new password hash");
    
    // Update the user's password
    await db.update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, admin.id));
    
    console.log("Admin password reset successfully!");
    
    // Verify the update
    const [updatedAdmin] = await db.select().from(users).where(eq(users.id, admin.id));
    console.log("Password hash updated:", updatedAdmin.password !== admin.password);
    
    // Test if password verification works with the new hash
    const passwordVerifies = await bcrypt.compare("admin123", updatedAdmin.password);
    console.log("Password verification test:", passwordVerifies ? "Success" : "Failed");
    
  } catch (error) {
    console.error("Error resetting admin password:", error);
  }
}

// Run the reset function
resetAdminPassword().finally(() => {
  console.log("Password reset script completed");
});