// Data migration script: SQLite → Supabase
const { PrismaClient } = require('@prisma/client');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function migrateDataToSupabase() {
  console.log('🚀 Starting data migration from SQLite to Supabase...');
  
  // Check if SQLite database exists
  const sqliteDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  const fs = require('fs');
  
  if (!fs.existsSync(sqliteDbPath)) {
    console.log('❌ SQLite database not found at:', sqliteDbPath);
    return;
  }
  
  console.log('📁 Found SQLite database:', sqliteDbPath);
  
  // Connect to SQLite database
  const sqliteDb = new sqlite3.Database(sqliteDbPath);
  
  // Connect to Supabase database
  const supabaseDb = new PrismaClient();
  
  try {
    await supabaseDb.$connect();
    console.log('✅ Connected to Supabase database');
    
    // Migrate Users
    console.log('👥 Migrating users...');
    const users = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM users', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log(`Found ${users.length} users to migrate`);
    
    for (const user of users) {
      try {
        await supabaseDb.user.create({
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            password: user.password,
            image: user.image,
            role: user.role,
            isCreator: user.isCreator === 1,
            isSilenced: user.isSilenced === 1,
            silencedUntil: user.silencedUntil ? new Date(user.silencedUntil) : null,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
            profilePicture: user.profilePicture,
            cropSettings: user.cropSettings,
            themePreference: user.themePreference,
            accountId: user.accountId,
            emailVerified: user.emailVerified ? new Date(user.emailVerified) : null
          }
        });
        console.log(`✅ Migrated user: ${user.email}`);
      } catch (error) {
        console.log(`⚠️  User ${user.email} already exists or error:`, error.message);
      }
    }
    
    // Migrate Series
    console.log('📚 Migrating series...');
    const series = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM series', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log(`Found ${series.length} series to migrate`);
    
    for (const serie of series) {
      try {
        await supabaseDb.series.create({
          data: {
            id: serie.id,
            title: serie.title,
            description: serie.description,
            coverImage: serie.coverImage,
            isPublished: serie.isPublished === 1,
            createdAt: new Date(serie.createdAt),
            updatedAt: new Date(serie.updatedAt),
            creatorId: serie.creatorId,
            contentRating: serie.contentRating,
            tags: serie.tags,
            authors: serie.authors,
            artists: serie.artists,
            altTitles: serie.altTitles
          }
        });
        console.log(`✅ Migrated series: ${serie.title}`);
      } catch (error) {
        console.log(`⚠️  Series ${serie.title} already exists or error:`, error.message);
      }
    }
    
    // Migrate Chapters
    console.log('📖 Migrating chapters...');
    const chapters = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM chapters', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log(`Found ${chapters.length} chapters to migrate`);
    
    for (const chapter of chapters) {
      try {
        await supabaseDb.chapter.create({
          data: {
            id: chapter.id,
            title: chapter.title,
            chapterNumber: chapter.chapterNumber,
            pages: chapter.pages,
            isPublished: chapter.isPublished === 1,
            createdAt: new Date(chapter.createdAt),
            updatedAt: new Date(chapter.updatedAt),
            seriesId: chapter.seriesId,
            volumeId: chapter.volumeId,
            creatorId: chapter.creatorId
          }
        });
        console.log(`✅ Migrated chapter: ${chapter.title}`);
      } catch (error) {
        console.log(`⚠️  Chapter ${chapter.title} already exists or error:`, error.message);
      }
    }
    
    // Migrate Library Entries
    console.log('📚 Migrating library entries...');
    const libraryEntries = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM library_entries', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log(`Found ${libraryEntries.length} library entries to migrate`);
    
    for (const entry of libraryEntries) {
      try {
        await supabaseDb.libraryEntry.create({
          data: {
            id: entry.id,
            createdAt: new Date(entry.createdAt),
            updatedAt: new Date(entry.updatedAt),
            userId: entry.userId,
            seriesId: entry.seriesId,
            status: entry.status,
            rating: entry.rating,
            notes: entry.notes
          }
        });
        console.log(`✅ Migrated library entry for user: ${entry.userId}`);
      } catch (error) {
        console.log(`⚠️  Library entry already exists or error:`, error.message);
      }
    }
    
    // Migrate Comments
    console.log('💬 Migrating comments...');
    const comments = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM comments', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log(`Found ${comments.length} comments to migrate`);
    
    for (const comment of comments) {
      try {
        await supabaseDb.comment.create({
          data: {
            id: comment.id,
            content: comment.content,
            isHidden: comment.isHidden === 1,
            createdAt: new Date(comment.createdAt),
            updatedAt: new Date(comment.updatedAt),
            userId: comment.userId,
            seriesId: comment.seriesId,
            chapterId: comment.chapterId
          }
        });
        console.log(`✅ Migrated comment: ${comment.id}`);
      } catch (error) {
        console.log(`⚠️  Comment already exists or error:`, error.message);
      }
    }
    
    console.log('🎉 Data migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    sqliteDb.close();
    await supabaseDb.$disconnect();
  }
}

migrateDataToSupabase();
