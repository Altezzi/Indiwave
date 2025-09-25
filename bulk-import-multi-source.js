// Bulk import manga/manhwa with multiple data sources (AniList, MangaUpdates, MangaDex) and automatic real cover art!
const fs = require('fs');
const path = require('path');

// New diverse manga and manhwa series to add
const newMangaSeries = [
  // Popular Modern Manga
  { title: "Tokyo Revengers", description: "A delinquent travels back in time to save his girlfriend", author: "Ken Wakui", artist: "Ken Wakui", publisher: "Kodansha", tags: ["Action", "Time Travel", "Shounen"], contentRating: "mature" },
  { title: "Black Clover", description: "A magicless boy dreams of becoming the Wizard King", author: "Yuki Tabata", artist: "Yuki Tabata", publisher: "Shueisha", tags: ["Action", "Fantasy", "Shounen"], contentRating: "safe" },
  { title: "Dr. Stone", description: "A genius scientist rebuilds civilization after petrification", author: "Riichiro Inagaki", artist: "Boichi", publisher: "Shueisha", tags: ["Sci-Fi", "Adventure", "Shounen"], contentRating: "safe" },
  { title: "The Promised Neverland", description: "Orphans discover the dark truth about their home", author: "Kaiu Shirai", artist: "Posuka Demizu", publisher: "Shueisha", tags: ["Thriller", "Psychological", "Shounen"], contentRating: "mature" },
  { title: "Fire Force", description: "Firefighters fight infernals and uncover conspiracies", author: "Atsushi Okubo", artist: "Atsushi Okubo", publisher: "Kodansha", tags: ["Action", "Supernatural", "Shounen"], contentRating: "mature" },
  { title: "Mob Psycho 100", description: "A psychic middle schooler tries to live normally", author: "ONE", artist: "ONE", publisher: "Shogakukan", tags: ["Action", "Supernatural", "Shounen"], contentRating: "safe" },
  { title: "One Punch Man", description: "A hero who can defeat any enemy with one punch", author: "ONE", artist: "Yusuke Murata", publisher: "Shueisha", tags: ["Action", "Comedy", "Seinen"], contentRating: "safe" },
  { title: "The Rising of the Shield Hero", description: "A hero with only a shield in a fantasy world", author: "Aneko Yusagi", artist: "Minami Seira", publisher: "Kadokawa", tags: ["Fantasy", "Isekai", "Shounen"], contentRating: "mature" },
  { title: "That Time I Got Reincarnated as a Slime", description: "A man reincarnates as a slime in a fantasy world", author: "Fuse", artist: "Taiki Kawakami", publisher: "Kodansha", tags: ["Fantasy", "Isekai", "Shounen"], contentRating: "safe" },
  { title: "Overlord", description: "A gamer gets trapped in his favorite MMORPG", author: "Kugane Maruyama", artist: "Satoshi Oshio", publisher: "Kadokawa", tags: ["Fantasy", "Isekai", "Seinen"], contentRating: "mature" },
  
  // Modern Manhwa/Webtoons
  { title: "The Legend of the Northern Blade", description: "A martial artist seeks revenge in a world of cultivation", author: "Woo-Gak", artist: "Hae-Min", publisher: "Naver", tags: ["Action", "Martial Arts", "Manhwa"], contentRating: "mature" },
  { title: "Return of the Mount Hua Sect", description: "A martial artist returns to his sect after death", author: "Biga", artist: "Lico", publisher: "Naver", tags: ["Action", "Martial Arts", "Manhwa"], contentRating: "mature" },
  { title: "The Great Mage Returns After 4000 Years", description: "A mage returns after 4000 years to get revenge", author: "Barnicle", artist: "Ryu Song", publisher: "Naver", tags: ["Fantasy", "Magic", "Manhwa"], contentRating: "mature" },
  { title: "SSS-Class Suicide Hunter", description: "A hunter gains the ability to reset time by dying", author: "Shin Noah", artist: "Neon.B", publisher: "Naver", tags: ["Action", "Fantasy", "Manhwa"], contentRating: "mature" },
  { title: "The Beginning After The End", description: "A king reincarnates in a magical world", author: "TurtleMe", artist: "Fuyuki23", publisher: "Tapas", tags: ["Fantasy", "Reincarnation", "Manhwa"], contentRating: "safe" },
  { title: "Villain to Kill", description: "A hero reincarnates as a villain to save the world", author: "Park Sung-woo", artist: "Min Kyu", publisher: "Naver", tags: ["Action", "Fantasy", "Manhwa"], contentRating: "mature" },
  { title: "The World After The Fall", description: "A man survives the apocalypse and gains powers", author: "Singong", artist: "S-Cynan", publisher: "Naver", tags: ["Action", "Post-Apocalyptic", "Manhwa"], contentRating: "mature" },
  { title: "Reformation of the Deadbeat Noble", description: "A lazy noble reforms and becomes powerful", author: "Ro Yu-jin", artist: "Bi-an", publisher: "Naver", tags: ["Fantasy", "Action", "Manhwa"], contentRating: "mature" },
  { title: "The Greatest Estate Developer", description: "An engineer reincarnates and builds an empire", author: "Lee Hyun-min", artist: "Kim Hyun-soo", publisher: "Naver", tags: ["Fantasy", "Comedy", "Manhwa"], contentRating: "safe" },
  { title: "Return of the Shattered Constellation", description: "A constellation returns to claim its throne", author: "Sadoyeon", artist: "Sadoyeon", publisher: "Naver", tags: ["Fantasy", "Action", "Manhwa"], contentRating: "mature" },
  
  // Classic and Seinen Manga
  { title: "Kingdom", description: "A war orphan becomes a great general in ancient China", author: "Yasuhisa Hara", artist: "Yasuhisa Hara", publisher: "Shueisha", tags: ["Historical", "War", "Seinen"], contentRating: "mature" },
  { title: "Vagabond", description: "The legendary swordsman Miyamoto Musashi's journey", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Kodansha", tags: ["Historical", "Martial Arts", "Seinen"], contentRating: "mature" },
  { title: "Real", description: "Wheelchair basketball and personal struggles", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha", tags: ["Sports", "Drama", "Seinen"], contentRating: "mature" },
  { title: "Gantz", description: "Dead people are forced to hunt aliens", author: "Hiroya Oku", artist: "Hiroya Oku", publisher: "Shueisha", tags: ["Sci-Fi", "Horror", "Seinen"], contentRating: "mature" },
  { title: "Blade of the Immortal", description: "An immortal swordsman seeks redemption", author: "Hiroaki Samura", artist: "Hiroaki Samura", publisher: "Kodansha", tags: ["Historical", "Action", "Seinen"], contentRating: "mature" },
  { title: "Lone Wolf and Cub", description: "A ronin and his son travel as assassins", author: "Kazuo Koike", artist: "Goseki Kojima", publisher: "Kodansha", tags: ["Historical", "Action", "Seinen"], contentRating: "mature" },
  { title: "Akira", description: "A biker gang member gets psychic powers in Neo-Tokyo", author: "Katsuhiro Otomo", artist: "Katsuhiro Otomo", publisher: "Kodansha", tags: ["Sci-Fi", "Cyberpunk", "Seinen"], contentRating: "mature" },
  { title: "Ghost in the Shell", description: "Cyborg police in a cyberpunk future", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Kodansha", tags: ["Sci-Fi", "Cyberpunk", "Seinen"], contentRating: "mature" },
  { title: "Nausicaä of the Valley of the Wind", description: "A princess tries to stop war in a post-apocalyptic world", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten", tags: ["Fantasy", "Post-Apocalyptic", "Seinen"], contentRating: "safe" },
  { title: "The Rose of Versailles", description: "A woman disguises herself as a man in pre-revolutionary France", author: "Riyoko Ikeda", artist: "Riyoko Ikeda", publisher: "Shueisha", tags: ["Historical", "Romance", "Shoujo"], contentRating: "safe" },
  
  // Romance and Slice of Life
  { title: "Fruits Basket", description: "A girl discovers a family cursed to turn into zodiac animals", author: "Natsuki Takaya", artist: "Natsuki Takaya", publisher: "Hakusensha", tags: ["Romance", "Supernatural", "Shoujo"], contentRating: "safe" },
  { title: "Ouran High School Host Club", description: "A scholarship student joins a host club", author: "Bisco Hatori", artist: "Bisco Hatori", publisher: "Hakusensha", tags: ["Romance", "Comedy", "Shoujo"], contentRating: "safe" },
  { title: "Skip Beat!", description: "A girl becomes an actress to get revenge", author: "Yoshiki Nakamura", artist: "Yoshiki Nakamura", publisher: "Hakusensha", tags: ["Romance", "Comedy", "Shoujo"], contentRating: "safe" },
  { title: "Cardcaptor Sakura", description: "A girl captures magical cards that escaped", author: "CLAMP", artist: "CLAMP", publisher: "Kodansha", tags: ["Magical Girl", "Romance", "Shoujo"], contentRating: "safe" },
  { title: "Sailor Moon", description: "A schoolgirl becomes a magical warrior", author: "Naoko Takeuchi", artist: "Naoko Takeuchi", publisher: "Kodansha", tags: ["Magical Girl", "Romance", "Shoujo"], contentRating: "safe" },
  { title: "Yona of the Dawn", description: "A princess flees after her father is killed", author: "Mizuho Kusanagi", artist: "Mizuho Kusanagi", publisher: "Hakusensha", tags: ["Historical", "Romance", "Shoujo"], contentRating: "safe" },
  { title: "Nana", description: "Two women named Nana become roommates in Tokyo", author: "Ai Yazawa", artist: "Ai Yazawa", publisher: "Shueisha", tags: ["Drama", "Romance", "Josei"], contentRating: "mature" },
  { title: "Paradise Kiss", description: "A high school student models for fashion designers", author: "Ai Yazawa", artist: "Ai Yazawa", publisher: "Shodensha", tags: ["Romance", "Fashion", "Josei"], contentRating: "mature" },
  { title: "Honey and Clover", description: "Art students navigate love and life", author: "Chika Umino", artist: "Chika Umino", publisher: "Shueisha", tags: ["Slice of Life", "Romance", "Josei"], contentRating: "safe" },
  { title: "March Comes in Like a Lion", description: "A shogi player finds family and purpose", author: "Chika Umino", artist: "Chika Umino", publisher: "Hakusensha", tags: ["Slice of Life", "Sports", "Seinen"], contentRating: "safe" }
];

async function searchAniList(title) {
  try {
    const query = `
      query ($search: String) {
        Media(search: $search, type: MANGA) {
          id
          title {
            romaji
            english
            native
          }
          description
          startDate {
            year
          }
          status
          genres
          tags {
            name
          }
          coverImage {
            large
            medium
          }
          externalLinks {
            site
            url
          }
        }
      }
    `;

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: { search: title }
      })
    });

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.Media) {
      return {
        id: data.data.Media.id,
        title: data.data.Media.title.english || data.data.Media.title.romaji,
        description: data.data.Media.description,
        year: data.data.Media.startDate.year,
        status: data.data.Media.status,
        genres: data.data.Media.genres,
        tags: data.data.Media.tags.map(tag => tag.name),
        coverImage: data.data.Media.coverImage.large,
        externalLinks: data.data.Media.externalLinks
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error searching AniList:', error);
    return null;
  }
}

async function searchMangaUpdates(title) {
  try {
    // MangaUpdates doesn't have a public API, so we'll use web scraping simulation
    // In a real implementation, you'd use their search functionality
    console.log(`  📚 MangaUpdates search for: ${title} (simulated)`);
    return null; // Placeholder for MangaUpdates integration
  } catch (error) {
    console.error('Error searching MangaUpdates:', error);
    return null;
  }
}

async function searchMangaDex(title) {
  try {
    const response = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=5`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.result !== 'ok') {
      throw new Error('Invalid response from MangaDex');
    }

    return data.data.map((manga) => ({
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      description: manga.attributes.description?.en || manga.attributes.description,
      year: manga.attributes.year,
      status: manga.attributes.status,
      tags: manga.attributes.tags?.map(tag => tag.attributes.name.en) || []
    }));

  } catch (error) {
    console.error('Error searching MangaDex:', error);
    return null;
  }
}

async function downloadMangaDexCover(mangaId, seriesPath, title) {
  try {
    // Fetch manga data with cover art relationship
    const response = await fetch(`https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.result !== 'ok') {
      throw new Error('Invalid manga data from MangaDex');
    }

    // Get cover art URL
    const coverRelationship = data.data.relationships?.find((rel) => rel.type === 'cover_art');
    if (!coverRelationship) {
      throw new Error('No cover art found for this manga');
    }

    // Get cover art details
    const coverResponse = await fetch(`https://api.mangadex.org/cover/${coverRelationship.id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const coverData = await coverResponse.json();
    
    if (coverData.result !== 'ok') {
      throw new Error('Failed to get cover art details');
    }

    const fileName = coverData.data.attributes.fileName;
    const coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;

    // Download the cover image
    const imageResponse = await fetch(coverUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download cover: ${imageResponse.statusText}`);
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine file extension
    let extension = 'jpg';
    const contentType = imageResponse.headers.get('content-type');
    if (contentType?.includes('png')) {
      extension = 'png';
    } else if (contentType?.includes('webp')) {
      extension = 'webp';
    }

    const filename = `cover.${extension}`;
    const filePath = path.join(seriesPath, filename);

    // Write cover art file
    fs.writeFileSync(filePath, buffer);

    return {
      path: filePath,
      filename: filename,
      size: buffer.length,
      url: coverUrl
    };

  } catch (error) {
    console.error('Error downloading MangaDex cover art:', error);
    return null;
  }
}

async function downloadAniListCover(coverUrl, seriesPath, title) {
  try {
    if (!coverUrl) return null;

    const response = await fetch(coverUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download cover: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine file extension
    let extension = 'jpg';
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('png')) {
      extension = 'png';
    } else if (contentType?.includes('webp')) {
      extension = 'webp';
    }

    const filename = `cover.${extension}`;
    const filePath = path.join(seriesPath, filename);

    // Write cover art file
    fs.writeFileSync(filePath, buffer);

    return {
      path: filePath,
      filename: filename,
      size: buffer.length,
      url: coverUrl
    };

  } catch (error) {
    console.error('Error downloading AniList cover art:', error);
    return null;
  }
}

async function importWithMultiSource() {
  const seriesDir = path.join(process.cwd(), 'series');
  
  for (const manga of newMangaSeries) {
    try {
      console.log(`\n🔍 Processing: ${manga.title}`);
      
      // Sanitize folder name
      const sanitizedFolderName = manga.title
        .replace(/[<>:"/\\|?*]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      const newSeriesPath = path.join(seriesDir, sanitizedFolderName);

      // Check if series already exists
      if (fs.existsSync(newSeriesPath)) {
        console.log(`✅ Series already exists: ${manga.title}`);
        continue;
      }

      // Create series folder structure
      fs.mkdirSync(newSeriesPath, { recursive: true });
      fs.mkdirSync(path.join(newSeriesPath, 'volumes'), { recursive: true });
      fs.mkdirSync(path.join(newSeriesPath, 'seasons'), { recursive: true });

      let coverImageName = null;
      let mangaDexId = null;
      let aniListId = null;
      let sources = [];

      // Search AniList first
      try {
        console.log(`  📊 Searching AniList for: ${manga.title}`);
        const aniListResult = await searchAniList(manga.title);
        
        if (aniListResult) {
          aniListId = aniListResult.id;
          sources.push('anilist');
          console.log(`  ✅ Found AniList entry: ${aniListResult.title} (ID: ${aniListId})`);
          
          // Try to download cover from AniList
          if (aniListResult.coverImage) {
            const coverResult = await downloadAniListCover(aniListResult.coverImage, newSeriesPath, manga.title);
            if (coverResult) {
              coverImageName = coverResult.filename;
              console.log(`  🎨 Downloaded AniList cover: ${coverImageName} (${Math.round(coverResult.size / 1024)}KB)`);
            }
          }
        }
      } catch (error) {
        console.error(`  ❌ Error with AniList search: ${error.message}`);
      }

      // Search MangaUpdates (placeholder)
      try {
        const mangaUpdatesResult = await searchMangaUpdates(manga.title);
        if (mangaUpdatesResult) {
          sources.push('mangaupdates');
          console.log(`  ✅ Found MangaUpdates entry for: ${manga.title}`);
        }
      } catch (error) {
        console.error(`  ❌ Error with MangaUpdates search: ${error.message}`);
      }

      // Search MangaDex for additional data and cover art
      try {
        console.log(`  📚 Searching MangaDex for: ${manga.title}`);
        const mangaDexResults = await searchMangaDex(manga.title);
        
        if (mangaDexResults && mangaDexResults.length > 0) {
          const foundManga = mangaDexResults[0];
          mangaDexId = foundManga.id;
          sources.push('mangadex');
          console.log(`  ✅ Found MangaDex entry: ${foundManga.title} (ID: ${mangaDexId})`);
          
          // Download cover from MangaDex if we don't have one from AniList
          if (!coverImageName) {
            const coverResult = await downloadMangaDexCover(mangaDexId, newSeriesPath, manga.title);
            if (coverResult) {
              coverImageName = coverResult.filename;
              console.log(`  🎨 Downloaded MangaDex cover: ${coverImageName} (${Math.round(coverResult.size / 1024)}KB)`);
            }
          }
        }
      } catch (error) {
        console.error(`  ❌ Error with MangaDex search: ${error.message}`);
      }

      // Create metadata.json with multi-source data
      const metadata = {
        title: manga.title,
        description: manga.description,
        author: manga.author,
        artist: manga.artist,
        publisher: manga.publisher,
        publisherLinks: [],
        tags: manga.tags,
        contentRating: manga.contentRating,
        altTitles: [],
        coverImage: coverImageName,
        sources: sources, // Track which sources we used
        aniListId: aniListId,
        mangaDexId: mangaDexId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      fs.writeFileSync(
        path.join(newSeriesPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      console.log(`  📝 Created metadata.json with data from: ${sources.join(', ')}`);
      console.log(`  ✅ Successfully imported: ${manga.title}${coverImageName ? ' with REAL cover art' : ' (no cover found)'}`);
      
      // Small delay to avoid overwhelming the servers
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error(`❌ Error importing ${manga.title}: ${error.message}`);
    }
  }
}

importWithMultiSource();
