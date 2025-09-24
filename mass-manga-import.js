import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Configuration for massive import
const CREATOR_ID = 'cmfx1d8vd0000pzg0xqtyiko4'; // Admin user ID
const BATCH_SIZE = 10; // Process 10 manga at a time for efficiency
const MAX_MANGA_TO_IMPORT = 2000; // Import up to 2000 manga
const DELAY_BETWEEN_BATCHES = 1000; // 1 second delay between batches

// Create directories
const SERIES_DIR = path.join(process.cwd(), 'series');
const COVERS_DIR = path.join(process.cwd(), 'public', 'covers');

if (!fs.existsSync(SERIES_DIR)) {
  fs.mkdirSync(SERIES_DIR, { recursive: true });
}
if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
}

// Comprehensive list of manga categories and titles
const MANGA_CATEGORIES = {
  // Shounen Jump & Popular Shounen
  shounen: [
    'One Piece', 'Naruto', 'Dragon Ball', 'Bleach', 'Hunter x Hunter', 'My Hero Academia',
    'Demon Slayer', 'Jujutsu Kaisen', 'Chainsaw Man', 'Black Clover', 'One Punch Man',
    'Attack on Titan', 'Death Note', 'Fullmetal Alchemist', 'Fairy Tail', 'Sword Art Online',
    'The Promised Neverland', 'Dr. Stone', 'Fire Force', 'Mob Psycho 100', 'Re:Zero',
    'Konosuba', 'Overlord', 'That Time I Got Reincarnated as a Slime', 'The Rising of the Shield Hero',
    'No Game No Life', 'Steins Gate', 'Tokyo Ghoul', 'Parasyte', 'Ajin', 'Inuyasha',
    'Rurouni Kenshin', 'Yu Yu Hakusho', 'Gintama', 'JoJo\'s Bizarre Adventure', 'D.Gray-man',
    'Blue Exorcist', 'Soul Eater', 'Fire Punch', 'Hell\'s Paradise', 'Kaiju No. 8',
    'Undead Unluck', 'Mashle', 'Sakamoto Days', 'The Elusive Samurai', 'Witch Watch',
    'Me & Roboco', 'Mushoku Tensei', 'The Eminence in Shadow', 'Reincarnated as a Sword',
    'Boruto', 'Dragon Ball Super', 'Dragon Ball GT', 'Yu-Gi-Oh!', 'Pokemon Adventures',
    'Digimon Adventure', 'Vinland Saga', 'Kingdom', 'Berserk', 'Vagabond',
    'Blade of the Immortal', 'Lone Wolf and Cub', 'Samurai Champloo', 'Cowboy Bebop',
    'Trigun', 'Outlaw Star', 'Space Dandy', 'Ghost in the Shell', 'Akira',
    'Neon Genesis Evangelion', 'Gurren Lagann', 'Kill la Kill', 'Darling in the Franxx',
    'SSSS.Gridman', 'SSSS.Dynazenon', 'Gridman Universe'
  ],

  // Romance & Slice of Life
  romance: [
    'Your Name', 'Weathering With You', 'A Silent Voice', 'Your Lie in April', 'Clannad',
    'Toradora', 'Golden Time', 'Nisekoi', 'Love Hina', 'Rent a Girlfriend',
    'Kaguya-sama: Love is War', 'Horimiya', 'Wotakoi', 'My Dress-Up Darling',
    'More than a Married Couple', 'The Quintessential Quintuplets', 'We Never Learn',
    'Domestic Girlfriend', 'Scum\'s Wish', 'Citrus', 'Bloom Into You',
    'Adachi and Shimamura', 'Otherside Picnic', 'The Executioner and Her Way of Life',
    'I\'m in Love with the Villainess', 'Magical Girl Spec-Ops Asuka',
    'Puella Magi Madoka Magica', 'Sailor Moon', 'Cardcaptor Sakura', 'Precure',
    'Revolutionary Girl Utena', 'Rose of Versailles', 'Nana', 'Paradise Kiss',
    'Skip Beat', 'Fruits Basket', 'Ouran High School Host Club', 'Kimi ni Todoke',
    'Say I Love You', 'Ao Haru Ride', 'Orange', 'Anohana', 'Angel Beats',
    'Air', 'Kanon', 'Little Busters', 'Rewrite', 'Planetarian', 'Harmonia',
    'Summer Pockets', 'The Fruit of Grisaia', 'ChäoS;HEAd', 'Robotics;Notes',
    'Occultic;Nine', 'Ao no Kanata no Four Rhythm', 'Vampire Princess Miyu',
    'Sanoba Witch', 'Senren * Banka', 'Cafe Stella to Shinigami no Chou',
    'Dracu-Riot!', 'Honey!', 'Suzumiya Haruhi no Yuuutsu', 'Lucky Star',
    'Azumanga Daioh', 'Yotsuba&!', 'Barakamon', 'Silver Spoon',
    'Arakawa Under the Bridge', 'Sayonara Zetsubou Sensei', 'Joshiraku',
    'Soredemo Machi wa Mawatteiru', 'Working!!', 'Servant x Service',
    'New Game!', 'Gabriel DropOut', 'Kobayashi-san Chi no Maid Dragon',
    'The Disastrous Life of Saiki K.', 'Hinamatsuri', 'Grand Blue',
    'Asobi Asobase', 'Chio\'s School Road', 'Komi Can\'t Communicate',
    'Spy x Family', 'The Way of the Househusband', 'My Senpai is Annoying',
    'Don\'t Toy with Me, Miss Nagatoro', 'Uzaki-chan Wants to Hang Out!',
    'Teasing Master Takagi-san', 'Aharen-san wa Hakarenai',
    'Kubo Won\'t Let Me Be Invisible', 'The Dangers in My Heart',
    'Tonikaku Kawaii', 'Shikimori\'s Not Just a Cutie'
  ],

  // Horror & Psychological
  horror: [
    'Uzumaki', 'Tomie', 'Gyo', 'Hellstar Remina', 'The Enigma of Amigara Fault',
    'The Hanging Balloons', 'Black Paradox', 'Sensor', 'No Longer Human',
    'The Flowers of Evil', 'Inside Mari', 'Happiness', 'Blood on the Tracks',
    'Solanin', 'Nijigahara Holograph', 'Downfall', 'Dead Dead Demon\'s Dededede Destruction',
    'Monster', '20th Century Boys', '21st Century Boys', 'Pluto', 'Billy Bat',
    'Master Keaton', 'Luna Park', 'Happy!', 'Asadora!', 'The Garden of Words',
    '5 Centimeters per Second', 'Children Who Chase Lost Voices',
    'The Place Promised in Our Early Days', 'Voices of a Distant Star',
    'She and Her Cat', 'The Cat Returns', 'Whisper of the Heart',
    'From Up on Poppy Hill', 'The Wind Rises', 'The Tale of the Princess Kaguya',
    'When Marnie Was There', 'The Red Turtle', 'Mary and the Witch\'s Flower',
    'Mirai', 'The Night is Short, Walk on Girl', 'Lu Over the Wall',
    'Fireworks', 'Hello World', 'Josee, the Tiger and the Fish',
    'Words Bubble Up Like Soda Pop', 'Belle', 'Inu-Oh', 'The First Slam Dunk'
  ],

  // Sports & Competition
  sports: [
    'Haikyuu!!', 'Kuroko\'s Basketball', 'Slam Dunk', 'Real', 'Vagabond',
    'Eyeshield 21', 'Prince of Tennis', 'Ace of Diamond', 'Major', 'Cross Game',
    'Touch', 'H2', 'Rough', 'Katsu!', 'Mix', 'Captain Tsubasa', 'Inazuma Eleven',
    'Blue Lock', 'Ao Ashi', 'Days', 'Giant Killing', 'Whistle!',
    'The Prince of Tennis', 'Baby Steps', 'Yowamushi Pedal', 'Initial D',
    'Wangan Midnight', 'Capeta', 'Over Drive', 'Rideback', 'All Out!!',
    'Ahiru no Sora', 'Diamond no Ace', 'Hajime no Ippo', 'Baki',
    'Kengan Ashura', 'The Boxer', 'Lookism', 'How to Fight', 'Questism',
    'Manager Kim', 'Study Group', 'Weak Hero', 'Wind Breaker',
    'Get Schooled', 'Eleceed', 'Noblesse', 'Tower of God', 'Solo Leveling',
    'The Beginning After the End', 'Omniscient Reader\'s Viewpoint',
    'The World After the Fall', 'SSS-Class Revival Hunter', 'Return of the Mount Hua Sect',
    'The Greatest Estate Developer', 'The S-Classes That I Raised',
    'The Heavenly Demon Can\'t Live a Normal Life', 'The Return of the Crazy Demon',
    'The Return of the Disaster-Class Hero', 'The Return of the 8th Class Mage',
    'The Return of the Frozen Player', 'The Return of the Shattered Constellation',
    'The Return of the Legendary Spear Knight', 'The Return of the Legendary Spear Knight',
    'The Return of the Legendary Spear Knight', 'The Return of the Legendary Spear Knight'
  ],

  // Isekai & Fantasy
  isekai: [
    'The World\'s Finest Assassin Gets Reincarnated in Another World as an Aristocrat',
    'The Eminence in Shadow', 'Mushoku Tensei: Jobless Reincarnation', 'Reincarnated as a Sword',
    'The Rising of the Shield Hero', 'That Time I Got Reincarnated as a Slime', 'Overlord',
    'No Game No Life', 'Konosuba', 'Re:Zero - Starting Life in Another World',
    'Sword Art Online', 'Log Horizon', 'Grimgar of Fantasy and Ash', 'The Twelve Kingdoms',
    'Escaflowne', 'Magic Knight Rayearth', 'Fushigi Yuugi', 'Inuyasha', 'Ranma 1/2',
    'Urusei Yatsura', 'Maison Ikkoku', 'Rumiko Takahashi Anthology', 'The Great Cleric',
    'The Greatest Estate Developer', 'The Villainess Turns the Hourglass',
    'The Villainess Needs Her Tyrant', 'The Villainess Doesn\'t Need a New Husband!',
    'The Villainess\' Maker', 'The World God Only Knows', 'To Love Ru Darkness',
    'Toaru Majutsu no Index', 'Toaru Kagaku no Railgun', 'Tokyo Revengers',
    'Tonari no Seki no Yatsu ga Souiu Me de Mitekuru', 'Touch Your Heart',
    'Tower of God', 'Trigun Maximum', 'Tropic of the Sea', 'True Beauty',
    'Umineko WHEN THEY CRY', 'Undead Unluck', 'unOrdinary', 'Vagabond',
    'Villains Are Destined to Die', 'Vinland Saga', 'Viper', 'Wail of a Dragon\'s Rage',
    'Way to the Glory', 'Weak Hero', 'What\'s Wrong with Secretary Kim',
    'Wind Breaker', 'Witch Watch', 'Worth a Billion Modern-Day Courtesan',
    'Wotaku ni Koi wa Muzukashii', 'Wǒde Fūren Jìngshì Mójiào Jiàozhǔ',
    'Yamiochi Last Boss Reijou no Osananajimi ni Tensei shita',
    'Yosuga no Sora', 'Youjo Senki', 'Yu Yu Hakusho', 'Yumi\'s Cells',
    'Zettai Zetsubou Shoujo - Danganronpa Another Episode'
  ],

  // Comedy & Gag
  comedy: [
    'Gintama', 'Nichijou', 'Lucky Star', 'Azumanga Daioh', 'Yotsuba&!',
    'Barakamon', 'Silver Spoon', 'Arakawa Under the Bridge', 'Sayonara Zetsubou Sensei',
    'Joshiraku', 'Soredemo Machi wa Mawatteiru', 'Working!!', 'Servant x Service',
    'New Game!', 'Gabriel DropOut', 'Kobayashi-san Chi no Maid Dragon',
    'The Disastrous Life of Saiki K.', 'Hinamatsuri', 'Grand Blue', 'Asobi Asobase',
    'Chio\'s School Road', 'Komi Can\'t Communicate', 'Spy x Family',
    'The Way of the Househusband', 'My Senpai is Annoying', 'Don\'t Toy with Me, Miss Nagatoro',
    'Uzaki-chan Wants to Hang Out!', 'Teasing Master Takagi-san', 'Aharen-san wa Hakarenai',
    'Kubo Won\'t Let Me Be Invisible', 'The Dangers in My Heart', 'My Dress-Up Darling',
    'More than a Married Couple, but Not Lovers', 'The Quintessential Quintuplets',
    'We Never Learn', 'Rent-A-Girlfriend', 'Kaguya-sama: Love is War', 'Horimiya',
    'Wotakoi: Love is Hard for Otaku', 'Tonikaku Kawaii', 'Shikimori\'s Not Just a Cutie'
  ],

  // Action & Adventure
  action: [
    'Tokyo Ghoul', 'Parasyte', 'Ajin', 'Inuyasha', 'Rurouni Kenshin', 'Yu Yu Hakusho',
    'Gintama', 'JoJo\'s Bizarre Adventure', 'D.Gray-man', 'Blue Exorcist', 'Soul Eater',
    'Fire Punch', 'Hell\'s Paradise', 'Kaiju No. 8', 'Undead Unluck', 'Mashle',
    'Sakamoto Days', 'The Elusive Samurai', 'Witch Watch', 'Me & Roboco',
    'Mushoku Tensei', 'The Eminence in Shadow', 'Reincarnated as a Sword',
    'Boruto', 'Dragon Ball Super', 'Dragon Ball GT', 'Yu-Gi-Oh!', 'Pokemon Adventures',
    'Digimon Adventure', 'Vinland Saga', 'Kingdom', 'Berserk', 'Vagabond',
    'Blade of the Immortal', 'Lone Wolf and Cub', 'Samurai Champloo', 'Cowboy Bebop',
    'Trigun', 'Outlaw Star', 'Space Dandy', 'Ghost in the Shell', 'Akira',
    'Neon Genesis Evangelion', 'Gurren Lagann', 'Kill la Kill', 'Darling in the Franxx',
    'SSSS.Gridman', 'SSSS.Dynazenon', 'Gridman Universe', 'The World\'s Finest Assassin',
    'The Eminence in Shadow', 'Mushoku Tensei: Jobless Reincarnation', 'Reincarnated as a Sword',
    'The Rising of the Shield Hero', 'That Time I Got Reincarnated as a Slime', 'Overlord',
    'No Game No Life', 'Konosuba', 'Re:Zero - Starting Life in Another World',
    'Sword Art Online', 'Log Horizon', 'Grimgar of Fantasy and Ash', 'The Twelve Kingdoms',
    'Escaflowne', 'Magic Knight Rayearth', 'Fushigi Yuugi', 'Inuyasha', 'Ranma 1/2',
    'Urusei Yatsura', 'Maison Ikkoku', 'Rumiko Takahashi Anthology'
  ]
};

// Get existing series titles to avoid duplicates
async function getExistingSeries() {
  const existingSeries = await prisma.series.findMany({
    select: { title: true }
  });
  return new Set(existingSeries.map(s => s.title.toLowerCase()));
}

// Download cover image
async function downloadCoverImage(coverUrl, localPath) {
  try {
    const response = await fetch(coverUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://mangadex.org/',
        'Accept': 'image/*'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    fs.writeFileSync(localPath, Buffer.from(arrayBuffer));
    return true;
  } catch (error) {
    return false;
  }
}

// Search for manga on MangaDex
async function searchManga(title) {
  try {
    const searchUrl = `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=5&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[relevance]=desc`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

// Get manga details and cover
async function getMangaDetails(mangaId) {
  try {
    const mangaUrl = `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`;
    
    const response = await fetch(mangaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

// Create series folder and metadata
async function createSeriesFolder(manga, coverPath) {
  const seriesId = `series_${manga.id}`;
  const seriesFolder = path.join(SERIES_DIR, manga.attributes.title.en || manga.attributes.title.ja || 'Unknown Title');
  
  // Create series folder
  if (!fs.existsSync(seriesFolder)) {
    fs.mkdirSync(seriesFolder, { recursive: true });
  }
  
  // Create metadata.json
  const metadata = {
    title: manga.attributes.title.en || manga.attributes.title.ja || 'Unknown Title',
    description: manga.attributes.description?.en || manga.attributes.description?.ja || '',
    authors: manga.attributes.authors || [],
    artists: manga.attributes.artists || [],
    year: manga.attributes.year || new Date().getFullYear(),
    tags: manga.attributes.tags || [],
    status: manga.attributes.status || 'ongoing',
    contentRating: manga.attributes.contentRating || 'safe',
    mangaMDId: manga.id
  };
  
  const metadataPath = path.join(seriesFolder, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  // Copy cover image
  if (coverPath && fs.existsSync(coverPath)) {
    const coverExtension = path.extname(coverPath);
    const coverFileName = `cover${coverExtension}`;
    const seriesCoverPath = path.join(seriesFolder, coverFileName);
    fs.copyFileSync(coverPath, seriesCoverPath);
  }
  
  return seriesId;
}

// Import one manga
async function importManga(title) {
  try {
    const searchResults = await searchManga(title);
    if (searchResults.length === 0) {
      return false;
    }
    
    const manga = searchResults[0]; // Take the first (most relevant) result
    
    // Get detailed manga information
    const mangaDetails = await getMangaDetails(manga.id);
    if (!mangaDetails) {
      return false;
    }
    
    // Get cover image
    let coverPath = null;
    const coverArt = mangaDetails.relationships?.find(rel => rel.type === 'cover_art');
    if (coverArt) {
      const coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}.512.jpg`;
      const coverFileName = `${manga.id}.jpg`;
      const localCoverPath = path.join(COVERS_DIR, coverFileName);
      
      if (await downloadCoverImage(coverUrl, localCoverPath)) {
        coverPath = localCoverPath;
      }
    }
    
    // Create series folder
    const seriesId = await createSeriesFolder(mangaDetails, coverPath);
    
    // Add to database
    const series = await prisma.series.create({
      data: {
        id: seriesId,
        title: mangaDetails.attributes.title.en || mangaDetails.attributes.title.ja || 'Unknown Title',
        description: mangaDetails.attributes.description?.en || mangaDetails.attributes.description?.ja || '',
        coverImage: coverPath ? `/covers/${path.basename(coverPath)}` : '/placeholder-cover.jpg',
        authors: mangaDetails.attributes.authors?.join(', ') || '',
        artists: mangaDetails.attributes.artists?.join(', ') || '',
        mangaMDYear: mangaDetails.attributes.year || new Date().getFullYear(),
        tags: mangaDetails.attributes.tags?.join(', ') || '',
        mangaMDStatus: mangaDetails.attributes.status || 'ongoing',
        contentRating: mangaDetails.attributes.contentRating || 'safe',
        isPublished: true,
        isImported: true,
        creatorId: CREATOR_ID
      }
    });
    
    return true;
    
  } catch (error) {
    return false;
  }
}

// Main import function
async function massMangaImport() {
  try {
    console.log('🚀 Starting MASSIVE manga import...');
    
    // Get existing series to avoid duplicates
    const existingSeries = await getExistingSeries();
    console.log(`📚 Found ${existingSeries.size} existing series`);
    
    // Combine all manga titles from all categories
    const allMangaTitles = [];
    Object.values(MANGA_CATEGORIES).forEach(category => {
      allMangaTitles.push(...category);
    });
    
    // Remove duplicates and filter out existing ones
    const uniqueMangaTitles = [...new Set(allMangaTitles)];
    const newManga = uniqueMangaTitles.filter(title => 
      !existingSeries.has(title.toLowerCase())
    );
    
    console.log(`🆕 Found ${newManga.length} new manga to import`);
    console.log(`🎯 Target: Import up to ${MAX_MANGA_TO_IMPORT} manga`);
    
    if (newManga.length === 0) {
      console.log('🎉 All manga already imported!');
      return;
    }
    
    let importedCount = 0;
    let errorCount = 0;
    let totalProcessed = 0;
    
    // Process manga in batches
    for (let i = 0; i < Math.min(newManga.length, MAX_MANGA_TO_IMPORT); i += BATCH_SIZE) {
      const batch = newManga.slice(i, i + BATCH_SIZE);
      totalProcessed += batch.length;
      
      console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(Math.min(newManga.length, MAX_MANGA_TO_IMPORT) / BATCH_SIZE)}`);
      console.log(`📊 Progress: ${totalProcessed}/${Math.min(newManga.length, MAX_MANGA_TO_IMPORT)} (${Math.round((totalProcessed / Math.min(newManga.length, MAX_MANGA_TO_IMPORT)) * 100)}%)`);
      
      const promises = batch.map(title => importManga(title));
      const results = await Promise.all(promises);
      
      const batchImported = results.filter(r => r).length;
      const batchErrors = results.filter(r => !r).length;
      
      importedCount += batchImported;
      errorCount += batchErrors;
      
      console.log(`✅ Batch imported: ${batchImported} manga`);
      console.log(`❌ Batch errors: ${batchErrors} manga`);
      console.log(`📈 Total imported so far: ${importedCount} manga`);
      
      // Rate limiting
      if (i + BATCH_SIZE < newManga.length) {
        console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }
    
    console.log(`\n🎉 MASSIVE IMPORT COMPLETED!`);
    console.log(`✅ Successfully imported: ${importedCount} new manga`);
    console.log(`❌ Errors: ${errorCount} manga`);
    console.log(`📊 Success rate: ${Math.round((importedCount / (importedCount + errorCount)) * 100)}%`);
    
    // Show final count
    const finalCount = await prisma.series.count();
    console.log(`📚 Total series in database: ${finalCount}`);
    console.log(`🎯 Target achieved: ${finalCount >= 1000 ? 'YES' : 'NO'} (${finalCount}/1000+)`);
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

massMangaImport();
