// Bulk import manga/manhwa with automatic real cover art - targeting 1000+ series!
const fs = require('fs');
const path = require('path');

// New diverse manga and manhwa series to add
const newMangaSeries = [
  // Popular Modern Manga
  { title: "Blue Lock", description: "A soccer manga about a striker training facility", author: "Muneyuki Kaneshiro", artist: "Yusuke Nomura", publisher: "Kodansha", tags: ["Sports", "Soccer", "Shounen"], contentRating: "safe" },
  { title: "Chainsaw Man Part 2", description: "The continuation of the Chainsaw Man series", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha", tags: ["Action", "Horror", "Shounen"], contentRating: "mature" },
  { title: "Spy x Family", description: "A spy, assassin, and telepath form a fake family", author: "Tatsuya Endo", artist: "Tatsuya Endo", publisher: "Shueisha", tags: ["Comedy", "Action", "Shounen"], contentRating: "safe" },
  { title: "Jujutsu Kaisen", description: "A high school student becomes a sorcerer", author: "Gege Akutami", artist: "Gege Akutami", publisher: "Shueisha", tags: ["Action", "Supernatural", "Shounen"], contentRating: "mature" },
  { title: "My Hero Academia", description: "A boy without powers in a world of superheroes", author: "Kohei Horikoshi", artist: "Kohei Horikoshi", publisher: "Shueisha", tags: ["Action", "Superhero", "Shounen"], contentRating: "safe" },
  { title: "Demon Slayer", description: "A boy becomes a demon slayer to save his sister", author: "Koyoharu Gotouge", artist: "Koyoharu Gotouge", publisher: "Shueisha", tags: ["Action", "Supernatural", "Shounen"], contentRating: "mature" },
  { title: "Attack on Titan", description: "Humanity fights against giant humanoid Titans", author: "Hajime Isayama", artist: "Hajime Isayama", publisher: "Kodansha", tags: ["Action", "Drama", "Shounen"], contentRating: "mature" },
  { title: "One Piece", description: "A pirate's journey to find the ultimate treasure", author: "Eiichiro Oda", artist: "Eiichiro Oda", publisher: "Shueisha", tags: ["Adventure", "Action", "Shounen"], contentRating: "safe" },
  { title: "Naruto", description: "A ninja's journey to become the Hokage", author: "Masashi Kishimoto", artist: "Masashi Kishimoto", publisher: "Shueisha", tags: ["Action", "Ninja", "Shounen"], contentRating: "safe" },
  { title: "Dragon Ball", description: "A martial artist's adventures across the universe", author: "Akira Toriyama", artist: "Akira Toriyama", publisher: "Shueisha", tags: ["Action", "Martial Arts", "Shounen"], contentRating: "safe" },
  
  // Modern Manhwa/Webtoons
  { title: "Solo Leveling", description: "A weak hunter becomes the strongest", author: "Chu-Gong", artist: "Dubu", publisher: "D&C Media", tags: ["Action", "Fantasy", "Manhwa"], contentRating: "mature" },
  { title: "Tower of God", description: "A boy climbs a mysterious tower", author: "SIU", artist: "SIU", publisher: "Naver", tags: ["Action", "Fantasy", "Manhwa"], contentRating: "mature" },
  { title: "The Beginning After The End", description: "A king reincarnates in a magical world", author: "TurtleMe", artist: "Fuyuki23", publisher: "Tapas", tags: ["Fantasy", "Reincarnation", "Manhwa"], contentRating: "safe" },
  { title: "Omniscient Reader's Viewpoint", description: "A reader becomes the protagonist of a novel", author: "sing N song", artist: "Sleepy-C", publisher: "Munpia", tags: ["Fantasy", "Action", "Manhwa"], contentRating: "mature" },
  { title: "The God of High School", description: "High school students compete in martial arts", author: "Yongje Park", artist: "Yongje Park", publisher: "Naver", tags: ["Action", "Martial Arts", "Manhwa"], contentRating: "mature" },
  { title: "UnOrdinary", description: "A world where everyone has superpowers", author: "uruchan", artist: "uruchan", publisher: "Webtoon", tags: ["Superhero", "Drama", "Manhwa"], contentRating: "mature" },
  { title: "Lookism", description: "A boy gets a second chance at life", author: "Park Taejun", artist: "Park Taejun", publisher: "Naver", tags: ["Drama", "School Life", "Manhwa"], contentRating: "mature" },
  { title: "Wind Breaker", description: "A cyclist's journey to become the best", author: "Yongseok Jo", artist: "Yongseok Jo", publisher: "Naver", tags: ["Sports", "Cycling", "Manhwa"], contentRating: "safe" },
  { title: "Sweet Home", description: "Survivors in an apartment during a monster apocalypse", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Naver", tags: ["Horror", "Thriller", "Manhwa"], contentRating: "mature" },
  { title: "Bastard", description: "A serial killer's son tries to stop his father", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Naver", tags: ["Thriller", "Psychological", "Manhwa"], contentRating: "mature" },
  
  // Classic Manga
  { title: "Berserk", description: "A lone mercenary's journey in a dark fantasy world", author: "Kentaro Miura", artist: "Kentaro Miura", publisher: "Hakusensha", tags: ["Dark Fantasy", "Horror", "Seinen"], contentRating: "mature" },
  { title: "Monster", description: "A doctor's quest to stop a serial killer he saved", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan", tags: ["Thriller", "Psychological", "Seinen"], contentRating: "mature" },
  { title: "20th Century Boys", description: "Friends uncover a conspiracy from their childhood", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan", tags: ["Mystery", "Sci-Fi", "Seinen"], contentRating: "mature" },
  { title: "Pluto", description: "A robot detective investigates robot murders", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan", tags: ["Sci-Fi", "Mystery", "Seinen"], contentRating: "safe" },
  { title: "Vinland Saga", description: "A Viking's journey from revenge to peace", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha", tags: ["Historical", "Action", "Seinen"], contentRating: "mature" },
  { title: "Planetes", description: "Space debris collectors in the future", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha", tags: ["Sci-Fi", "Drama", "Seinen"], contentRating: "safe" },
  { title: "Blame!", description: "A silent warrior searches for humans in a vast city", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Cyberpunk", "Seinen"], contentRating: "mature" },
  { title: "Dorohedoro", description: "A lizard-headed man searches for his identity", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan", tags: ["Fantasy", "Horror", "Seinen"], contentRating: "mature" },
  { title: "Akira", description: "A biker gang member gets psychic powers", author: "Katsuhiro Otomo", artist: "Katsuhiro Otomo", publisher: "Kodansha", tags: ["Sci-Fi", "Cyberpunk", "Seinen"], contentRating: "mature" },
  { title: "Ghost in the Shell", description: "Cyborg police in a cyberpunk future", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Kodansha", tags: ["Sci-Fi", "Cyberpunk", "Seinen"], contentRating: "mature" },
  
  // Romance and Slice of Life
  { title: "Kaguya-sama: Love is War", description: "Two genius students try to make the other confess", author: "Aka Akasaka", artist: "Aka Akasaka", publisher: "Shueisha", tags: ["Romance", "Comedy", "Shounen"], contentRating: "safe" },
  { title: "Horimiya", description: "A popular girl and a quiet boy's relationship", author: "Hero", artist: "Daisuke Hagiwara", publisher: "Square Enix", tags: ["Romance", "Slice of Life", "Shounen"], contentRating: "safe" },
  { title: "Your Lie in April", description: "A pianist meets a violinist who changes his life", author: "Naoshi Arakawa", artist: "Naoshi Arakawa", publisher: "Kodansha", tags: ["Romance", "Music", "Shounen"], contentRating: "safe" },
  { title: "Toradora!", description: "Two students help each other with their crushes", author: "Yuyuko Takemiya", artist: "Zekkyou", publisher: "ASCII Media Works", tags: ["Romance", "Comedy", "Shounen"], contentRating: "safe" },
  { title: "Orange", description: "A girl receives letters from her future self", author: "Ichigo Takano", artist: "Ichigo Takano", publisher: "Futabasha", tags: ["Romance", "Drama", "Shoujo"], contentRating: "safe" },
  { title: "A Silent Voice", description: "A former bully tries to make amends", author: "Yoshitoki Oima", artist: "Yoshitoki Oima", publisher: "Kodansha", tags: ["Drama", "School Life", "Seinen"], contentRating: "safe" },
  { title: "I Want to Eat Your Pancreas", description: "A boy befriends a girl with a terminal illness", author: "Yoru Sumino", artist: "id", publisher: "Futabasha", tags: ["Drama", "Romance", "Seinen"], contentRating: "safe" },
  { title: "5 Centimeters Per Second", description: "Three stories about distance and love", author: "Makoto Shinkai", artist: "Yukiko Seike", publisher: "Kodansha", tags: ["Romance", "Drama", "Seinen"], contentRating: "safe" },
  { title: "Your Name", description: "Two teenagers mysteriously swap bodies", author: "Makoto Shinkai", artist: "Ranmaru Kotone", publisher: "Kadokawa", tags: ["Romance", "Fantasy", "Seinen"], contentRating: "safe" },
  { title: "Weathering with You", description: "A boy meets a girl who can control the weather", author: "Makoto Shinkai", artist: "Wataru Kubota", publisher: "Kadokawa", tags: ["Romance", "Fantasy", "Seinen"], contentRating: "safe" },
  
  // Sports Manga
  { title: "Haikyuu!!", description: "A short boy's journey to become a volleyball ace", author: "Haruichi Furudate", artist: "Haruichi Furudate", publisher: "Shueisha", tags: ["Sports", "Volleyball", "Shounen"], contentRating: "safe" },
  { title: "Kuroko's Basketball", description: "A basketball team with supernatural abilities", author: "Tadatoshi Fujimaki", artist: "Tadatoshi Fujimaki", publisher: "Shueisha", tags: ["Sports", "Basketball", "Shounen"], contentRating: "safe" },
  { title: "Eyeshield 21", description: "A weak boy becomes a football star", author: "Riichiro Inagaki", artist: "Yusuke Murata", publisher: "Shueisha", tags: ["Sports", "Football", "Shounen"], contentRating: "safe" },
  { title: "Ace of Diamond", description: "A baseball pitcher's journey to the top", author: "Yuji Terajima", artist: "Yuji Terajima", publisher: "Kodansha", tags: ["Sports", "Baseball", "Shounen"], contentRating: "safe" },
  { title: "Captain Tsubasa", description: "A soccer prodigy's journey to become the best", author: "Yoichi Takahashi", artist: "Yoichi Takahashi", publisher: "Shueisha", tags: ["Sports", "Soccer", "Shounen"], contentRating: "safe" },
  { title: "Prince of Tennis", description: "A tennis prodigy dominates the court", author: "Takeshi Konomi", artist: "Takeshi Konomi", publisher: "Shueisha", tags: ["Sports", "Tennis", "Shounen"], contentRating: "safe" },
  { title: "Hajime no Ippo", description: "A bullied boy becomes a boxing champion", author: "George Morikawa", artist: "George Morikawa", publisher: "Kodansha", tags: ["Sports", "Boxing", "Shounen"], contentRating: "mature" },
  { title: "Initial D", description: "A delivery driver becomes a street racing legend", author: "Shuichi Shigeno", artist: "Shuichi Shigeno", publisher: "Kodansha", tags: ["Sports", "Racing", "Seinen"], contentRating: "mature" },
  { title: "Yowamushi Pedal", description: "A cycling otaku becomes a competitive racer", author: "Wataru Watanabe", artist: "Wataru Watanabe", publisher: "Akita Shoten", tags: ["Sports", "Cycling", "Shounen"], contentRating: "safe" },
  { title: "Free!", description: "High school boys form a swimming club", author: "Kouji Ooji", artist: "Kouji Ooji", publisher: "Kyoto Animation", tags: ["Sports", "Swimming", "Shounen"], contentRating: "safe" }
];

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
      status: manga.attributes.status
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

async function importWithRealCovers() {
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

      // Search for and download cover art automatically
      try {
        console.log(`  🔎 Searching MangaDex for: ${manga.title}`);
        const searchResult = await searchMangaDex(manga.title);
        
        if (searchResult && searchResult.length > 0) {
          // Use the first (most relevant) result
          const foundManga = searchResult[0];
          mangaDexId = foundManga.id;
          
          console.log(`  ✅ Found MangaDex entry: ${foundManga.title} (ID: ${mangaDexId})`);
          
          // Download the cover art
          const coverResult = await downloadMangaDexCover(mangaDexId, newSeriesPath, manga.title);
          if (coverResult) {
            coverImageName = coverResult.filename;
            console.log(`  🎨 Downloaded REAL cover: ${coverImageName} (${Math.round(coverResult.size / 1024)}KB)`);
          }
        } else {
          console.log(`  ⚠️ No MangaDex results found for: ${manga.title}`);
        }
      } catch (error) {
        console.error(`  ❌ Error with automatic cover search: ${error.message}`);
      }

      // Create metadata.json
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
        coverImage: coverImageName, // Store local filename, not URL
        source: 'mangadex',
        mangaDexId: mangaDexId, // Store MangaDex ID if found
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      fs.writeFileSync(
        path.join(newSeriesPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      console.log(`  📝 Created metadata.json for: ${manga.title}`);
      console.log(`  ✅ Successfully imported: ${manga.title}${coverImageName ? ' with REAL cover art' : ' (no cover found)'}`);
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Error importing ${manga.title}: ${error.message}`);
    }
  }
}

importWithRealCovers();
