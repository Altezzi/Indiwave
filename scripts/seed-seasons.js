const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding seasons data...');

  // First, create a test user if it doesn't exist
  let testUser = await prisma.user.findFirst({
    where: { email: 'test@example.com' }
  });

  if (!testUser) {
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        role: 'CREATOR',
        isCreator: true
      }
    });
    console.log('Created test user:', testUser.id);
  }

  // First, create a test series if it doesn't exist
  let testSeries = await prisma.series.findFirst({
    where: { title: 'Test Series for Seasons' }
  });

  if (!testSeries) {
    testSeries = await prisma.series.create({
      data: {
        title: 'Test Series for Seasons',
        description: 'A test series to demonstrate the seasons functionality',
        coverImage: 'https://via.placeholder.com/400x600/333/fff?text=Test+Series',
        authors: 'Test Author',
        artists: 'Test Artist',
        tags: 'test, demo, seasons',
        mangaMDStatus: 'ongoing',
        contentRating: 'safe',
        isPublished: true,
        creatorId: testUser.id,
        isImported: false
      }
    });
    console.log('Created test series:', testSeries.id);
  }

  // Create some test seasons
  const seasons = [
    {
      title: 'Season 1: The Beginning',
      seasonNumber: 1,
      description: 'The first season of our test series, introducing the main characters and setting.',
      coverImage: 'https://via.placeholder.com/400x600/333/fff?text=Season+1',
      seriesId: testSeries.id,
      creatorId: testUser.id,
      isPublished: true
    },
    {
      title: 'Season 2: The Adventure Continues',
      seasonNumber: 2,
      description: 'The second season where our heroes face new challenges and meet new allies.',
      coverImage: 'https://via.placeholder.com/400x600/333/fff?text=Season+2',
      seriesId: testSeries.id,
      creatorId: testUser.id,
      isPublished: true
    },
    {
      title: 'Season 3: The Final Battle',
      seasonNumber: 3,
      description: 'The epic conclusion to our test series with the ultimate showdown.',
      coverImage: 'https://via.placeholder.com/400x600/333/fff?text=Season+3',
      seriesId: testSeries.id,
      creatorId: testUser.id,
      isPublished: false // Keep this one as draft
    }
  ];

  for (const seasonData of seasons) {
    const existingSeason = await prisma.season.findFirst({
      where: {
        seriesId: seasonData.seriesId,
        seasonNumber: seasonData.seasonNumber
      }
    });

    if (!existingSeason) {
      const season = await prisma.season.create({
        data: seasonData
      });
      console.log(`Created season: ${season.title} (${season.id})`);

      // Create some test chapters for each season
      const chapters = [
        {
          title: `Chapter 1: ${season.title.split(':')[0]} Begins`,
          chapterNumber: 1,
          pages: 'https://via.placeholder.com/800x1200/333/fff?text=Page+1,https://via.placeholder.com/800x1200/333/fff?text=Page+2,https://via.placeholder.com/800x1200/333/fff?text=Page+3',
          isPublished: true,
          seriesId: null, // This chapter belongs to a season, not main series
          seasonId: season.id,
          creatorId: testUser.id
        },
        {
          title: `Chapter 2: ${season.title.split(':')[0]} Continues`,
          chapterNumber: 2,
          pages: 'https://via.placeholder.com/800x1200/333/fff?text=Page+1,https://via.placeholder.com/800x1200/333/fff?text=Page+2,https://via.placeholder.com/800x1200/333/fff?text=Page+3,https://via.placeholder.com/800x1200/333/fff?text=Page+4',
          isPublished: true,
          seriesId: null,
          seasonId: season.id,
          creatorId: testUser.id
        }
      ];

      for (const chapterData of chapters) {
        const chapter = await prisma.chapter.create({
          data: chapterData
        });
        console.log(`  Created chapter: ${chapter.title} (${chapter.id})`);
      }
    } else {
      console.log(`Season ${seasonData.seasonNumber} already exists for series ${testSeries.title}`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
