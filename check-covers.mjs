import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCovers() {
  console.log('🔍 Checking cover types in database...');

  const allManga = await prisma.series.findMany({
    select: {
      id: true,
      title: true,
      coverImage: true
    },
    take: 10
  });

  console.log(`📚 Found ${allManga.length} manga (showing first 10):`);
  
  allManga.forEach(manga => {
    const coverType = manga.coverImage ? 
      (manga.coverImage.startsWith('https://') ? 'MangaDex URL' : 
       manga.coverImage.startsWith('/covers/') ? 'Local Cover' :
       manga.coverImage === '/placeholder.svg' ? 'Placeholder' : 'Other') : 'None';
    
    console.log(`  📖 ${manga.title}: ${coverType}`);
  });

  // Count by type
  const mangadexCount = await prisma.series.count({
    where: { coverImage: { startsWith: 'https://uploads.mangadex.org/' } }
  });
  
  const placeholderCount = await prisma.series.count({
    where: { coverImage: '/placeholder.svg' }
  });
  
  const localCount = await prisma.series.count({
    where: { coverImage: { startsWith: '/covers/' } }
  });
  
  const nullCount = await prisma.series.count({
    where: { coverImage: null }
  });

  console.log('\n📊 Cover type breakdown:');
  console.log(`   🌐 MangaDex URLs: ${mangadexCount}`);
  console.log(`   📁 Local covers: ${localCount}`);
  console.log(`   🖼️  Placeholders: ${placeholderCount}`);
  console.log(`   ❌ No cover: ${nullCount}`);
}

checkCovers()
  .catch(e => {
    console.error('❌ Failed to check covers:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
