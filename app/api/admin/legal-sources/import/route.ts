import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { legalSourcesService } from '@/lib/legalSources';

export async function POST(request: NextRequest) {
  try {
    console.log('Legal sources import API called');
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      console.log('Unauthorized access attempt:', { user: session?.user?.email, role: session?.user?.role });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mangaTitle, sourceId, creatorId } = await request.json();
    console.log('Legal sources import request data:', { mangaTitle, sourceId, creatorId });

    if (!mangaTitle || !sourceId || !creatorId) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Manga title, source ID, and creator ID are required' },
        { status: 400 }
      );
    }

    // Check if series already exists
    console.log('Checking if series already exists...');
    const existingSeries = await prisma.series.findFirst({
      where: {
        title: { contains: mangaTitle }
      }
    });

    if (existingSeries) {
      console.log('Series already exists:', existingSeries.id);
      return NextResponse.json(
        { error: 'Series with this title already exists' },
        { status: 409 }
      );
    }

    // Verify creator exists
    console.log('Verifying creator exists...');
    const creator = await prisma.user.findUnique({
      where: { id: creatorId }
    });

    if (!creator) {
      console.log('Creator not found:', creatorId);
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }

    console.log('Creator found:', creator.name || creator.email);

    // Fetch manga metadata from legal source
    console.log('Fetching manga metadata from legal source...');
    const mangaData = await legalSourcesService.fetchMangaMetadataFromLegalSource(mangaTitle, sourceId);
    
    if (!mangaData) {
      console.log('Failed to fetch manga data from legal source');
      return NextResponse.json(
        { error: 'Failed to fetch manga data from legal source' },
        { status: 404 }
      );
    }

    console.log('Manga metadata fetched:', {
      title: mangaData.title,
      totalChapters: mangaData.totalChapters,
      status: mangaData.status,
      source: mangaData.source
    });

    // Create the series in the database
    console.log('Creating series in database...');
    const series = await prisma.series.create({
      data: {
        title: mangaData.title,
        description: mangaData.description,
        coverImage: mangaData.coverImage,
        mangaMDId: `legal-${sourceId}-${mangaTitle.toLowerCase().replace(/\s+/g, '-')}`,
        mangaMDTitle: mangaData.title,
        mangaMDStatus: mangaData.status,
        mangaMDYear: new Date().getFullYear(),
        contentRating: 'safe',
        tags: JSON.stringify(['Official', 'Legal Source']),
        authors: JSON.stringify([mangaData.author]),
        artists: JSON.stringify([mangaData.artist]),
        altTitles: JSON.stringify([]),
        isImported: true,
        isPublished: true,
        creatorId,
      },
    });

    console.log('Series created successfully:', series.id);

    // Fetch chapter metadata from legal source
    console.log('Fetching chapter metadata...');
    const chaptersData = await legalSourcesService.fetchChapterMetadataFromLegalSource(mangaTitle, sourceId);
    console.log('Chapter metadata fetched:', chaptersData.length, 'chapters found');

    // Create chapters in database
    console.log('Creating chapters...');
    const createdChapters = [];
    
    for (const chapterData of chaptersData) {
      try {
        // Create chapter in database
        const chapter = await prisma.chapter.create({
          data: {
            title: chapterData.title,
            chapterNumber: chapterData.chapterNumber,
            pages: JSON.stringify([]), // Empty pages - no actual content
            isPublished: true,
            seriesId: series.id,
            creatorId: series.creatorId,
            mangaMDChapterId: chapterData.id,
            mangaMDChapterTitle: chapterData.title,
            mangaMDChapterNumber: chapterData.chapterNumber,
            mangaMDPages: 0, // No actual pages
            mangaMDTranslatedLanguage: 'en',
            mangaMDPublishAt: chapterData.publishedAt,
          },
        });
        
        createdChapters.push({
          id: chapter.id,
          title: chapter.title,
          chapterNumber: chapter.chapterNumber,
        });
        
        console.log(`Created chapter: ${chapterData.title} (${chapterData.chapterNumber})`);
      } catch (chapterError) {
        console.error(`Error creating chapter ${chapterData.id}:`, chapterError);
        // Continue with other chapters even if one fails
      }
    }
    
    console.log(`Successfully created ${createdChapters.length} chapters`);

    // Create reading site entries for legal sources
    console.log('Creating legal source reading sites...');
    const availableSources = legalSourcesService.getAvailableSources(mangaTitle);
    const createdReadingSites = [];
    
    for (const source of availableSources) {
      try {
        // Create a reading site entry for this legal source
        const readingSite = await prisma.userUrl.create({
          data: {
            url: mangaData.sourceUrl,
            label: source.name,
            seriesId: series.id, // Link to the series
            userId: creatorId, // Use creator as the "owner" of these official links
          },
        });
        
        createdReadingSites.push({
          id: readingSite.id,
          label: readingSite.label,
          url: readingSite.url,
        });
        
        console.log(`Created reading site: ${source.name}`);
      } catch (siteError) {
        console.error(`Error creating reading site for ${source.name}:`, siteError);
        // Continue with other sources even if one fails
      }
    }
    
    console.log(`Successfully created ${createdReadingSites.length} reading sites`);

    return NextResponse.json({
      success: true,
      series: {
        id: series.id,
        title: series.title,
        description: series.description,
        coverImage: series.coverImage,
        source: mangaData.source,
        sourceUrl: mangaData.sourceUrl,
        status: mangaData.status,
        totalChapters: mangaData.totalChapters,
      },
      chapters: {
        count: createdChapters.length,
        total: mangaData.totalChapters,
        chapters: createdChapters,
      },
      readingSites: {
        count: createdReadingSites.length,
        sites: createdReadingSites,
      }
    });

  } catch (error) {
    console.error('Error importing from legal source:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded for legal source' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
