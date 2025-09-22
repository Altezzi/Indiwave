import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { mangaMDService } from '@/lib/mangaMD';
import { publisherSourcesService } from '@/lib/publisherSources';

export async function POST(request: NextRequest) {
  try {
    console.log('Import API called');
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      console.log('Unauthorized access attempt:', { user: session?.user?.email, role: session?.user?.role });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mangaMDId, creatorId } = await request.json();
    console.log('Import request data:', { mangaMDId, creatorId });

    if (!mangaMDId || !creatorId) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'MangaMD ID and creator ID are required' },
        { status: 400 }
      );
    }

    // Check if series already exists
    console.log('Checking if series already exists...');
    const existingSeries = await prisma.series.findUnique({
      where: { mangaMDId }
    });

    if (existingSeries) {
      console.log('Series already exists:', existingSeries.id);
      return NextResponse.json(
        { error: 'Series with this MangaMD ID already exists' },
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

          // Fetch manga data from MangaDex
          console.log('Fetching manga data from MangaDex...');
          const mangaData = await mangaMDService.getMangaById(mangaMDId);
          console.log('Manga data fetched, getting covers...');
          const coversData = await mangaMDService.getMangaCovers(mangaMDId);
          console.log('Covers data fetched, getting ALL chapters...');
          const allChapters = await mangaMDService.getAllMangaChapters(mangaMDId);
          console.log('All chapters fetched:', allChapters.length, 'chapters found');

    // Get the best title and description
    const title = mangaMDService.getBestTitle(mangaData);
    const description = mangaMDService.getBestDescription(mangaData);
    
    // Get authors and artists
    const { authors, artists } = mangaMDService.getAuthorsAndArtists(mangaData);
    
    // Get all tags
    const allTags = mangaMDService.getAllTags(mangaData);
    
    // Get cover image URL (use the first cover if available)
    let coverImageUrl = null;
    if (coversData.data.length > 0) {
      coverImageUrl = mangaMDService.getCoverUrl(coversData.data[0], 'large');
    }

    // Create the series in the database
    console.log('Creating series in database...');
    console.log('Series data:', {
      title,
      description: description?.substring(0, 100) + '...',
      coverImage: coverImageUrl,
      mangaMDId,
      mangaMDStatus: mangaData.status,
      mangaMDYear: mangaData.year,
      contentRating: mangaData.contentRating,
      tags: allTags.length,
      authors: authors.length,
      artists: artists.length,
      creatorId,
    });

    const series = await prisma.series.create({
      data: {
        title,
        description,
        coverImage: coverImageUrl,
        mangaMDId,
        mangaMDTitle: title,
        mangaMDStatus: mangaData.status,
        mangaMDYear: mangaData.year,
        contentRating: mangaData.contentRating,
        tags: JSON.stringify(allTags),
        authors: JSON.stringify(authors),
        artists: JSON.stringify(artists),
        altTitles: JSON.stringify(mangaData.altTitles || []),
        isImported: true,
        isPublished: true, // Auto-publish imported series
        creatorId,
      },
    });

    console.log('Series created successfully:', series.id);

    // Create chapters for the series
    console.log('Creating chapters...');
    const createdChapters = [];
    
    for (const chapterData of allChapters) {
      try {
        // Extract chapter number from the chapter attribute
        const chapterNumber = chapterData.attributes.chapter ? 
          parseFloat(chapterData.attributes.chapter) : 
          createdChapters.length + 1;
        
        // Create chapter title
        const chapterTitle = chapterData.attributes.title || 
          `Chapter ${chapterNumber}`;
        
        // Create chapter in database
        const chapter = await prisma.chapter.create({
          data: {
            title: chapterTitle,
            chapterNumber: chapterNumber,
            pages: JSON.stringify([]), // Empty pages array for now
            isPublished: true,
            seriesId: series.id,
            mangaMDChapterId: chapterData.id,
            mangaMDChapterTitle: chapterTitle,
            mangaMDChapterNumber: chapterNumber,
            mangaMDPages: chapterData.attributes.pages,
            mangaMDTranslatedLanguage: chapterData.attributes.translatedLanguage,
            mangaMDPublishAt: new Date(chapterData.attributes.publishAt),
          },
        });
        
        createdChapters.push({
          id: chapter.id,
          title: chapter.title,
          chapterNumber: chapter.chapterNumber,
        });
        
        console.log(`Created chapter: ${chapterTitle} (${chapterNumber})`);
      } catch (chapterError) {
        console.error(`Error creating chapter ${chapterData.id}:`, chapterError);
        // Continue with other chapters even if one fails
      }
    }
    
    console.log(`Successfully created ${createdChapters.length} chapters`);

    // Create publisher source links instead of MangaDex
    console.log('Creating publisher source links...');
    try {
      const publisherSources = await publisherSourcesService.getPublisherSources(title, authors);
      
      for (const source of publisherSources) {
        await prisma.userUrl.create({
          data: {
            url: source.url,
            label: source.name,
            seriesId: series.id,
            userId: creatorId, // Use creator as the "owner" of this official link
          },
        });
      }
      console.log(`Created ${publisherSources.length} publisher source links`);
    } catch (siteError) {
      console.error('Error creating publisher source links:', siteError);
      // Fallback to default sources
      try {
        const defaultSources = publisherSourcesService.getDefaultPublisherSources();
        for (const source of defaultSources) {
          await prisma.userUrl.create({
            data: {
              url: source.url,
              label: source.name,
              seriesId: series.id,
              userId: creatorId,
            },
          });
        }
        console.log('Created default publisher source links as fallback');
      } catch (fallbackError) {
        console.error('Error creating fallback publisher sources:', fallbackError);
      }
    }

    return NextResponse.json({
      success: true,
      series: {
        id: series.id,
        title: series.title,
        description: series.description,
        coverImage: series.coverImage,
        mangaMDId: series.mangaMDId,
        mangaMDStatus: series.mangaMDStatus,
        tags: allTags,
        authors,
        artists,
      },
      chapters: {
        count: createdChapters.length,
        total: allChapters.length,
        chapters: createdChapters,
      }
    });

  } catch (error) {
    console.error('Error importing manga from MangaMD:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('MangaMD API error')) {
        return NextResponse.json(
          { error: 'Failed to fetch data from MangaMD API' },
          { status: 502 }
        );
      }
      if (error.message.includes('Failed to fetch manga')) {
        return NextResponse.json(
          { error: 'Manga not found on MangaMD' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
