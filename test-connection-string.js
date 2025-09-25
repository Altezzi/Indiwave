// Test the connection string format
const connectionString = "postgresql://postgres:Impetigo8423@@db.uvzlcfqbwwaqafzjeivx.supabase.co:5432/postgres";

console.log("Testing connection string format...");
console.log("Connection string:", connectionString);

// Check if the connection string has the right format
const url = new URL(connectionString);
console.log("Protocol:", url.protocol);
console.log("Username:", url.username);
console.log("Password:", url.password);
console.log("Hostname:", url.hostname);
console.log("Port:", url.port);
console.log("Database:", url.pathname);

// Test if we can connect
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: connectionString
      }
    }
  });
  
  try {
    await prisma.$connect();
    console.log("✅ Connection successful!");
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
