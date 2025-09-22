import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setPlaceholders() {
  console.log('🚀 Setting all manga to use placeholders...');

  // Update all manga with MangaDex URLs to use placeholders
  const result = await prisma.series.updateMany({
    where: {
      coverImage: {
        startsWith: 'https://uploads.mangadex.org/'
      }
    },
    data: {
      coverImage: '/placeholder.svg'
    }
  });

  console.log(`✅ Updated ${result.count} manga to use placeholders`);
  console.log('🎉 All manga now use placeholder covers!');
}

setPlaceholders()
  .catch(e => {
    console.error('❌ Failed to set placeholders:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
