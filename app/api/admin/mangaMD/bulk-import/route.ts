import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { mangaMDService } from '@/lib/mangaMD';
import { publisherSourcesService } from '@/lib/publisherSources';

export async function POST(request: NextRequest) {
  try {
    console.log('Bulk import API called');
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      console.log('Unauthorized access attempt:', { user: session?.user?.email, role: session?.user?.role });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { batchSize = 50, maxManga = 1000, creatorId } = await request.json();
    console.log('Bulk import request data:', { batchSize, maxManga, creatorId });

    if (!creatorId) {
      console.log('Missing creator ID');
      return NextResponse.json(
        { error: 'Creator ID is required' },
        { status: 400 }
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

    // Start bulk import process
    console.log('Starting bulk import from MangaDex...');
    
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    
    // Get all manga from MangaDex (this will be a large request)
    console.log('Fetching all manga from MangaDex...');
    const allManga = await mangaMDService.searchManga('', 500, 0); // Get first 500 manga
    
    console.log(`Found ${allManga.data.length} manga to process`);

    // Process manga in batches
    for (let i = 0; i < Math.min(allManga.data.length, maxManga); i += batchSize) {
      const batch = allManga.data.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}: manga ${i + 1} to ${Math.min(i + batchSize, allManga.data.length)}`);
      
      for (const manga of batch) {
        try {
          // Check if series already exists
          const existingSeries = await prisma.series.findUnique({
            where: { mangaMDId: manga.id }
          });

          if (existingSeries) {
            console.log(`Skipping existing manga: ${manga.id}`);
            skippedCount++;
            continue;
          }

          // Get manga details
          const mangaData = await mangaMDService.getMangaById(manga.id);
          const coversData = await mangaMDService.getMangaCovers(manga.id);
          
          // Get the best title and description
          const title = mangaMDService.getBestTitle(mangaData);
          const description = mangaMDService.getBestDescription(mangaData);
          
          // Get authors and artists
          const { authors, artists } = mangaMDService.getAuthorsAndArtists(mangaData);
          
          // Get all tags
          const allTags = mangaMDService.getAllTags(mangaData);
          
          // Get cover image URL
          let coverImageUrl = null;
          if (coversData.data.length > 0) {
            coverImageUrl = mangaMDService.getCoverUrl(coversData.data[0], 'large');
          }

          // Create the series in the database
          const series = await prisma.series.create({
            data: {
              title,
              description,
              coverImage: coverImageUrl,
              mangaMDId: manga.id,
              mangaMDTitle: title,
              mangaMDStatus: mangaData.status,
              mangaMDYear: mangaData.year,
              contentRating: mangaData.contentRating,
              tags: JSON.stringify(allTags),
              authors: JSON.stringify(authors),
              artists: JSON.stringify(artists),
              altTitles: JSON.stringify(mangaData.altTitles || []),
              isImported: true,
              isPublished: false, // Don't auto-publish, let admin curate
              creatorId,
            },
          });

          // Get all chapters for this manga
          console.log(`Fetching chapters for ${title}...`);
          const allChapters = await mangaMDService.getAllMangaChapters(manga.id);
          
          // Create chapters
          for (const chapterData of allChapters) {
            try {
              const chapterNumber = chapterData.attributes.chapter ? 
                parseFloat(chapterData.attributes.chapter) : 
                0;
              
              const chapterTitle = chapterData.attributes.title || 
                `Chapter ${chapterNumber}`;
              
              await prisma.chapter.create({
                data: {
                  title: chapterTitle,
                  chapterNumber: chapterNumber,
                  pages: JSON.stringify([]),
                  isPublished: false, // Don't auto-publish chapters
                  seriesId: series.id,
                  creatorId: series.creatorId,
                  mangaMDChapterId: chapterData.id,
                  mangaMDChapterTitle: chapterTitle,
                  mangaMDChapterNumber: chapterNumber,
                  mangaMDPages: chapterData.attributes.pages,
                  mangaMDTranslatedLanguage: chapterData.attributes.translatedLanguage,
                  mangaMDPublishAt: new Date(chapterData.attributes.publishAt),
                },
              });
            } catch (chapterError) {
              console.error(`Error creating chapter ${chapterData.id}:`, chapterError);
            }
          }

          // Create publisher source links instead of MangaDex
          try {
            const publisherSources = await publisherSourcesService.getPublisherSources(title, authors);
            
            for (const source of publisherSources) {
              await prisma.userUrl.create({
                data: {
                  url: source.url,
                  label: source.name,
                  seriesId: series.id,
                  userId: creatorId,
                },
              });
            }
          } catch (sourceError) {
            console.error('Error creating publisher sources:', sourceError);
            // Fallback to default sources
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
          }

          importedCount++;
          console.log(`✅ Imported: ${title} (${allChapters.length} chapters)`);
          
          // Add delay to be respectful to the API
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error) {
          errorCount++;
          const errorMsg = `Failed to import manga ${manga.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
      
      // Add delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`Bulk import completed: ${importedCount} imported, ${skippedCount} skipped, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      summary: {
        imported: importedCount,
        skipped: skippedCount,
        errors: errorCount,
        total: allManga.data.length,
      },
      errors: errors.slice(0, 10), // Return first 10 errors
    });

  } catch (error) {
    console.error('Error in bulk import:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('MangaMD API error')) {
        return NextResponse.json(
          { error: 'Failed to fetch data from MangaDex API' },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
