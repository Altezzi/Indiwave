// Migration script to move from SQLite to Supabase
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function migrateToSupabase() {
  console.log('🚀 Starting migration to Supabase...');
  
  // Check if we have the old SQLite database
  const sqliteDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  const hasOldDb = fs.existsSync(sqliteDbPath);
  
  if (hasOldDb) {
    console.log('📁 Found existing SQLite database');
    console.log('⚠️  Note: This script will create new tables in Supabase');
    console.log('⚠️  You may need to manually migrate data if needed');
  }
  
  try {
    // Test Supabase connection
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('✅ Connected to Supabase database');
    
    // Run migrations
    console.log('📦 Running database migrations...');
    const { execSync } = require('child_process');
    
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Database migrations completed');
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
    
    // Test the connection
    const userCount = await prisma.user.count();
    console.log(`✅ Database is ready! Found ${userCount} users`);
    
    await prisma.$disconnect();
    console.log('🎉 Migration to Supabase completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateToSupabase();
