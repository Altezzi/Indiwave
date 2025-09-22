import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAllMangaData() {
  console.log('🗑️  Clearing all existing manga data...');
  
  try {
    // Delete in order to respect foreign key constraints
    console.log('   - Deleting user URLs...');
    await prisma.userUrl.deleteMany();

    console.log('   - Deleting comments...');
    await prisma.comment.deleteMany();

    console.log('   - Deleting library entries...');
    await prisma.libraryEntry.deleteMany();

    console.log('   - Deleting ratings...');
    await prisma.rating.deleteMany();

    console.log('   - Deleting creator claims...');
    await prisma.creatorClaim.deleteMany();

    console.log('   - Deleting chapters...');
    await prisma.chapter.deleteMany();

    console.log('   - Deleting series...');
    await prisma.series.deleteMany();

    console.log('✅ All manga data cleared successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error clearing manga data:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

clearAllMangaData();
