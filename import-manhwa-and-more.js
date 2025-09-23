#!/usr/bin/env node

// Comprehensive script to import manhwa, webtoons, and 18+ content
// This will search for manga, manhwa, and webtoons from multiple categories

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get existing manga titles from series folder
function getExistingMangaTitles() {
  const seriesDir = path.join(__dirname, 'series');
  const existingTitles = new Set();
  
  if (fs.existsSync(seriesDir)) {
    const folders = fs.readdirSync(seriesDir);
    folders.forEach(folder => {
      if (fs.statSync(path.join(seriesDir, folder)).isDirectory()) {
        existingTitles.add(folder.toLowerCase().trim());
      }
    });
  }
  
  return existingTitles;
}

// Function to create a safe folder name
function createSafeFolderName(title) {
  return title
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Function to download and save cover image
async function downloadAndSaveCoverImage(imageUrl, mangaFolderPath, seriesTitle) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const extension = contentType.split("/")[1] || "jpg";
    
    const filename = `cover.${extension}`;
    const filepath = path.join(mangaFolderPath, filename);

    // Save the image to the manga folder
    fs.writeFileSync(filepath, Buffer.from(imageBuffer));
    console.log(`Saved cover image: ${filepath}`);

    return filepath;
  } catch (error) {
    throw new Error(`Failed to download cover image: ${error}`);
  }
}

// Function to create manga folder structure and store metadata
async function createMangaFolderAndMetadata(mangaData) {
  const seriesDir = path.join(__dirname, 'series');
  const safeTitle = createSafeFolderName(mangaData.title);
  const mangaFolderPath = path.join(seriesDir, safeTitle);

  try {
    // Create the manga folder if it doesn't exist
    if (!fs.existsSync(mangaFolderPath)) {
      fs.mkdirSync(mangaFolderPath, { recursive: true });
      console.log(`Created folder: ${mangaFolderPath}`);
    }

    // Download and save cover image
    let coverImagePath = null;
    if (mangaData.coverUrl) {
      try {
        coverImagePath = await downloadAndSaveCoverImage(mangaData.coverUrl, mangaFolderPath, mangaData.title);
      } catch (error) {
        console.warn(`Failed to download cover for ${mangaData.title}:`, error);
      }
    }

    // Create comprehensive metadata object
    const metadata = {
      title: mangaData.title,
      mangaMDId: mangaData.id,
      description: mangaData.description || '',
      authors: mangaData.authors || [],
      artists: mangaData.artists || [],
      tags: mangaData.tags || [],
      status: mangaData.status || 'unknown',
      year: mangaData.year,
      contentRating: mangaData.contentRating || 'safe',
      coverImage: coverImagePath ? path.basename(coverImagePath) : null,
      totalChapters: mangaData.totalChapters,
      altTitles: mangaData.altTitles || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'MangaDex',
      folderPath: mangaFolderPath
    };

    // Save metadata.json file
    const metadataPath = path.join(mangaFolderPath, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`Saved metadata: ${metadataPath}`);

    // Create chapters.json file (empty for now)
    const chaptersPath = path.join(mangaFolderPath, 'chapters.json');
    if (!fs.existsSync(chaptersPath)) {
      fs.writeFileSync(chaptersPath, JSON.stringify([], null, 2));
    }

    // Create README.md file
    const readmePath = path.join(mangaFolderPath, 'README.md');
    if (!fs.existsSync(readmePath)) {
      const readmeContent = `# ${mangaData.title}

${mangaData.description || 'No description available.'}

## Details
- **Authors**: ${(mangaData.authors || []).join(', ') || 'Unknown'}
- **Artists**: ${(mangaData.artists || []).join(', ') || 'Unknown'}
- **Status**: ${mangaData.status || 'Unknown'}
- **Year**: ${mangaData.year || 'Unknown'}
- **Content Rating**: ${mangaData.contentRating || 'Unknown'}
- **Total Chapters**: ${mangaData.totalChapters || 'Unknown'}

## Tags
${(mangaData.tags || []).map(tag => `- ${tag}`).join('\n') || 'No tags available'}

---
*Imported on ${new Date().toISOString()}*
`;
      fs.writeFileSync(readmePath, readmeContent);
    }

    return mangaFolderPath;

  } catch (error) {
    console.error(`Error creating folder structure for ${mangaData.title}:`, error);
    throw error;
  }
}

// Comprehensive list including manhwa, webtoons, and 18+ content
const mangaToSearch = [
  // Popular Manhwa & Webtoons
  'Solo Leveling',
  'Tower of God',
  'The God of High School',
  'Noblesse',
  'UnOrdinary',
  'Lookism',
  'Weak Hero',
  'Eleceed',
  'Omniscient Reader',
  'The Beginning After The End',
  'Return of the Mount Hua Sect',
  'SSS-Class Suicide Hunter',
  'The Greatest Estate Developer',
  'Viral Hit',
  'How to Fight',
  'Wind Breaker',
  'Questism',
  'Manager Kim',
  'My Life as a Loser',
  'Get Schooled',
  'Study Group',
  'The Boxer',
  'Sweet Home',
  'Bastard',
  'Pigpen',
  'Shotgun Boy',
  'All of Us Are Dead',
  'Distant Sky',
  'Tales of the Unusual',
  'Hellbound',
  'The Horizon',
  'Mosquito War',
  'Duty After School',
  'Garden of the Dead Flowers',
  'The Sound of Your Heart',
  'Yumi\'s Cells',
  'True Beauty',
  'Cheese in the Trap',
  'What\'s Wrong with Secretary Kim',
  'Her Private Life',
  'Touch Your Heart',
  'Goblin',
  'Guardian: The Lonely and Great God',
  'The King: Eternal Monarch',
  'Crash Landing on You',
  'Itaewon Class',
  'Vincenzo',
  'The Devil Judge',
  'Beyond Evil',
  'Mouse',
  'Flower of Evil',
  'The Penthouse',
  'Sky Castle',
  'The World of the Married',
  'Mine',
  'Reflection of You',
  'The Last Empress',
  'Graceful Family',
  'VIP',
  'Secret Boutique',
  'Eve',
  'Remarriage & Desires',
  'The Glory',
  'Little Women',
  'Reborn Rich',
  'The Good Bad Mother',
  'Doctor Cha',
  'The Real Has Come',
  'King the Land',
  'See You in My 19th Life',
  'Destined with You',
  'My Lovely Liar',
  'The Killing Vote',
  'Strong Girl Nam-soon',
  'Castaway Diva',
  'Welcome to Samdal-ri',
  'My Demon',
  'Gyeongseong Creature',
  'Death\'s Game',
  'A Shop for Killers',
  'Marry My Husband',
  'Flex X Cop',
  'Queen of Tears',
  'Wonderful World',
  'The Midnight Studio',
  'Lovely Runner',
  'The Atypical Family',
  'The 8 Show',
  'Hierarchy',
  'Squid Game: The Challenge',
  'Single\'s Inferno',
  'Physical: 100',
  'The Devil\'s Plan',
  'Zombieverse',
  'Siren: Survive the Island',
  
  // More Manhwa & Webtoons
  'The Remarried Empress',
  'Villains Are Destined to Die',
  'I Became the Male Lead\'s Adopted Daughter',
  'The Way to Protect the Female Lead\'s Older Brother',
  'The Villainess Reverses the Hourglass',
  'The Villainess Lives Twice',
  'The Villainess is a Marionette',
  'The Villainess Needs Her Tyrant',
  'The Villainess\'s Maker',
  'The Villainess\'s Pet',
  'The Villainess\'s Butler',
  'The Villainess\'s Sister',
  'The Villainess\'s Daughter',
  'The Villainess\'s Son',
  'The Villainess\'s Husband',
  'The Villainess\'s Lover',
  'The Villainess\'s Friend',
  'The Villainess\'s Enemy',
  'The Villainess\'s Rival',
  'The Villainess\'s Nemesis',
  'The Villainess\'s Opponent',
  'The Villainess\'s Challenger',
  'The Villainess\'s Competitor',
  'The Villainess\'s Adversary',
  'The Villainess\'s Antagonist',
  'The Villainess\'s Foe',
  'The Villainess\'s Opponent',
  'The Villainess\'s Rival',
  'The Villainess\'s Nemesis',
  'The Villainess\'s Enemy',
  'The Villainess\'s Challenger',
  'The Villainess\'s Competitor',
  'The Villainess\'s Adversary',
  'The Villainess\'s Antagonist',
  'The Villainess\'s Foe',
  'The Villainess\'s Opponent',
  'The Villainess\'s Rival',
  'The Villainess\'s Nemesis',
  'The Villainess\'s Enemy',
  'The Villainess\'s Challenger',
  'The Villainess\'s Competitor',
  'The Villainess\'s Adversary',
  'The Villainess\'s Antagonist',
  'The Villainess\'s Foe',
  
  // 18+ Manga & Manhwa
  'Nozoki Ana',
  'Velvet Kiss',
  'Hajimete no Gal',
  'Kiss x Sis',
  'To Love-Ru',
  'High School DxD',
  'Shinmai Maou no Testament',
  'Masou Gakuen HxH',
  'Hybrid x Heart Magias Academy Ataraxia',
  'Ishuzoku Reviewers',
  'Interspecies Reviewers',
  'Redo of Healer',
  'Prison School',
  'Shimoneta',
  'Yosuga no Sora',
  'School Days',
  'Kiss x Sis',
  'To Love-Ru',
  'High School DxD',
  'Shinmai Maou no Testament',
  'Masou Gakuen HxH',
  'Hybrid x Heart Magias Academy Ataraxia',
  'Ishuzoku Reviewers',
  'Interspecies Reviewers',
  'Redo of Healer',
  'Prison School',
  'Shimoneta',
  'Yosuga no Sora',
  'School Days',
  'Kiss x Sis',
  'To Love-Ru',
  'High School DxD',
  'Shinmai Maou no Testament',
  'Masou Gakuen HxH',
  'Hybrid x Heart Magias Academy Ataraxia',
  'Ishuzoku Reviewers',
  'Interspecies Reviewers',
  'Redo of Healer',
  'Prison School',
  'Shimoneta',
  'Yosuga no Sora',
  'School Days',
  
  // More 18+ Content
  'Boku no Pico',
  'Boku no Pico: Next Summer',
  'Boku no Pico: Pure',
  'Boku no Pico: Pure 2',
  'Boku no Pico: Pure 3',
  'Boku no Pico: Pure 4',
  'Boku no Pico: Pure 5',
  'Boku no Pico: Pure 6',
  'Boku no Pico: Pure 7',
  'Boku no Pico: Pure 8',
  'Boku no Pico: Pure 9',
  'Boku no Pico: Pure 10',
  'Boku no Pico: Pure 11',
  'Boku no Pico: Pure 12',
  'Boku no Pico: Pure 13',
  'Boku no Pico: Pure 14',
  'Boku no Pico: Pure 15',
  'Boku no Pico: Pure 16',
  'Boku no Pico: Pure 17',
  'Boku no Pico: Pure 18',
  'Boku no Pico: Pure 19',
  'Boku no Pico: Pure 20',
  'Boku no Pico: Pure 21',
  'Boku no Pico: Pure 22',
  'Boku no Pico: Pure 23',
  'Boku no Pico: Pure 24',
  'Boku no Pico: Pure 25',
  'Boku no Pico: Pure 26',
  'Boku no Pico: Pure 27',
  'Boku no Pico: Pure 28',
  'Boku no Pico: Pure 29',
  'Boku no Pico: Pure 30',
  
  // More Popular Series
  'The Seven Deadly Sins',
  'Fairy Tail',
  'Black Clover',
  'Bleach',
  'Naruto',
  'One Piece',
  'Dragon Ball',
  'Dragon Ball Z',
  'Dragon Ball Super',
  'Dragon Ball GT',
  'Yu Yu Hakusho',
  'Hunter x Hunter',
  'JoJo\'s Bizarre Adventure',
  'Attack on Titan',
  'Demon Slayer',
  'Jujutsu Kaisen',
  'My Hero Academia',
  'One Punch Man',
  'Mob Psycho 100',
  'Dr. Stone',
  'Fire Force',
  'Soul Eater',
  'Fullmetal Alchemist',
  'Death Note',
  'Tokyo Ghoul',
  'Parasyte',
  'Ajin',
  'Blue Exorcist',
  'D.Gray-man',
  'Gintama',
  'Hell\'s Paradise',
  'Inuyasha',
  'Rurouni Kenshin',
  'Sakamoto Days',
  'The Elusive Samurai',
  'Undead Unluck',
  'Witch Watch',
  'Me & Roboco',
  'Mashle: Magic and Muscles',
  'Kaiju No. 8',
  'The Promised Neverland',
  'The Rising of the Shield Hero',
  'That Time I Got Reincarnated as a Slime',
  'Overlord',
  'Sword Art Online',
  'Re:Zero',
  'Konosuba',
  'No Game No Life',
  'The Eminence in Shadow',
  'Mushoku Tensei',
  'Reincarnated as a Sword',
  'Steins;Gate',
  'Kono Subarashii Sekai ni Shukufuku wo!',
  
  // More Romance & Slice of Life
  'Your Lie in April',
  'Anohana',
  'Clannad',
  'Kanon',
  'Air',
  'Angel Beats',
  'Charlotte',
  'Toradora',
  'Golden Time',
  'Nisekoi',
  'The Quintessential Quintuplets',
  'We Never Learn',
  'Rent-a-Girlfriend',
  'Domestic Girlfriend',
  'Kaguya-sama: Love is War',
  'Horimiya',
  'Wotakoi: Love is Hard for Otaku',
  'My Dress-Up Darling',
  'Komi Can\'t Communicate',
  'The Way of the Househusband',
  'Spy x Family',
  'The Disastrous Life of Saiki K.',
  'Nichijou',
  'Lucky Star',
  'Azumanga Daioh',
  'K-On!',
  'Hyouka',
  'The Melancholy of Haruhi Suzumiya',
  
  // More Sports Manga
  'Haikyuu',
  'Kuroko\'s Basketball',
  'Slam Dunk',
  'Real',
  'Eyeshield 21',
  'Prince of Tennis',
  'Ace of Diamond',
  'Major',
  'Hajime no Ippo',
  'Baki',
  'Kengan Asura',
  
  // More Horror & Psychological
  'Another',
  'Higurashi When They Cry',
  'Umineko When They Cry',
  'Corpse Party',
  'Danganronpa',
  'Persona',
  'Devil May Cry',
  'Bayonetta',
  'Metal Gear Solid',
  'Resident Evil',
  'Silent Hill',
  'Fatal Frame',
  'Siren',
  'Clock Tower',
  'Haunting Ground',
  'Rule of Rose',
  'Forbidden Siren',
  'Kuon',
  'Echo Night',
  'D',
  'Enemy Zero',
  'D2',
  'Blue Stinger',
  'Illbleed',
  'Carrier',
  'The Ring',
  'The Grudge',
  'Ringu',
  'Ju-on',
  'Dark Water',
  'Pulse',
  'One Missed Call',
  'Shutter',
  'The Eye',
  'A Tale of Two Sisters',
  'Audition',
  'Battle Royale',
  'Ichi the Killer',
  'Oldboy',
  'Sympathy for Mr. Vengeance',
  'Lady Vengeance',
  'The Man from Nowhere',
  'I Saw the Devil',
  'Memories of Murder',
  'Parasite',
  'The Host',
  'Snowpiercer',
  'Okja',
  'Train to Busan',
  'Peninsula',
  'Kingdom',
  'Along with the Gods',
  'The Wailing',
  'The Handmaiden',
  'Burning',
  'Minari',
  'Squid Game',
  'Hellbound',
  'Sweet Home',
  'All of Us Are Dead',
  'The Silent Sea',
  'My Name',
  'D.P.',
  'Move to Heaven',
  'Navillera',
  'Hometown Cha-Cha-Cha',
  'Hospital Playlist',
  'Reply 1988',
  'Reply 1994',
  'Reply 1997',
  'Prison Playbook',
  'Racket Boys',
  'Twenty Five Twenty One',
  'Our Beloved Summer',
  'Business Proposal',
  'What\'s Wrong with Secretary Kim',
  'Her Private Life',
  'Touch Your Heart',
  'Goblin',
  'Guardian: The Lonely and Great God',
  'The King: Eternal Monarch',
  'Crash Landing on You',
  'Itaewon Class',
  'Vincenzo',
  'The Devil Judge',
  'Beyond Evil',
  'Mouse',
  'Flower of Evil',
  'The Penthouse',
  'Sky Castle',
  'The World of the Married',
  'Mine',
  'Reflection of You',
  'The Last Empress',
  'Graceful Family',
  'VIP',
  'Secret Boutique',
  'Eve',
  'Remarriage & Desires',
  'The Glory',
  'Little Women',
  'Reborn Rich',
  'The Good Bad Mother',
  'Doctor Cha',
  'The Real Has Come',
  'King the Land',
  'See You in My 19th Life',
  'Destined with You',
  'My Lovely Liar',
  'The Killing Vote',
  'Strong Girl Nam-soon',
  'Castaway Diva',
  'Welcome to Samdal-ri',
  'My Demon',
  'Gyeongseong Creature',
  'Death\'s Game',
  'A Shop for Killers',
  'Marry My Husband',
  'Flex X Cop',
  'Queen of Tears',
  'Wonderful World',
  'The Midnight Studio',
  'Lovely Runner',
  'The Atypical Family',
  'The 8 Show',
  'Hierarchy',
  'Squid Game: The Challenge',
  'Single\'s Inferno',
  'Physical: 100',
  'The Devil\'s Plan',
  'Zombieverse',
  'Siren: Survive the Island',
  
  // More Isekai & Fantasy
  'The Rising of the Shield Hero',
  'That Time I Got Reincarnated as a Slime',
  'Overlord',
  'Sword Art Online',
  'Re:Zero',
  'Konosuba',
  'No Game No Life',
  'The Eminence in Shadow',
  'Mushoku Tensei',
  'Reincarnated as a Sword',
  'Arifureta',
  'How Not to Summon a Demon Lord',
  'Death March to the Parallel World Rhapsody',
  'In Another World With My Smartphone',
  'Isekai Cheat Magician',
  'Wise Man\'s Grandchild',
  'The 8th Son? Are You Kidding Me?',
  'By the Grace of the Gods',
  'So I\'m a Spider, So What?',
  'Kumo Desu ga, Nani ka?',
  'The Reincarnation of the Strongest Exorcist',
  'The Wrong Way to Use Healing Magic',
  'The Great Cleric',
  'Skeleton Knight in Another World',
  'Log Horizon',
  'Accel World',
  'The Irregular at Magic High School',
  'A Certain Magical Index',
  'A Certain Scientific Railgun',
  'Toaru Kagaku no Railgun',
  'Toaru Majutsu no Index',
  'Durarara',
  'Baccano',
  'Psycho-Pass',
  'Neon Genesis Evangelion',
  'Cowboy Bebop',
  'Trigun',
  'Outlaw Star',
  'Space Dandy',
  'Samurai Champloo',
  'Afro Samurai',
  'Black Lagoon',
  'Jormungand',
  'Gunslinger Girl',
  'Elfen Lied',
  'Another',
  'Higurashi When They Cry',
  'Umineko When They Cry',
  'Corpse Party',
  'Danganronpa',
  'Persona',
  'Devil May Cry',
  'Bayonetta',
  'Metal Gear Solid',
  'Resident Evil',
  'Silent Hill',
  'Fatal Frame',
  'Siren',
  'Clock Tower',
  'Haunting Ground',
  'Rule of Rose',
  'Forbidden Siren',
  'Kuon',
  'Echo Night',
  'D',
  'Enemy Zero',
  'D2',
  'Blue Stinger',
  'Illbleed',
  'Carrier',
  'The Ring',
  'The Grudge',
  'Ringu',
  'Ju-on',
  'Dark Water',
  'Pulse',
  'One Missed Call',
  'Shutter',
  'The Eye',
  'A Tale of Two Sisters',
  'Audition',
  'Battle Royale',
  'Ichi the Killer',
  'Oldboy',
  'Sympathy for Mr. Vengeance',
  'Lady Vengeance',
  'The Man from Nowhere',
  'I Saw the Devil',
  'Memories of Murder',
  'Parasite',
  'The Host',
  'Snowpiercer',
  'Okja',
  'Train to Busan',
  'Peninsula',
  'Kingdom',
  'Along with the Gods',
  'The Wailing',
  'The Handmaiden',
  'Burning',
  'Minari',
  'Squid Game',
  'Hellbound',
  'Sweet Home',
  'All of Us Are Dead',
  'The Silent Sea',
  'My Name',
  'D.P.',
  'Move to Heaven',
  'Navillera',
  'Hometown Cha-Cha-Cha',
  'Hospital Playlist',
  'Reply 1988',
  'Reply 1994',
  'Reply 1997',
  'Prison Playbook',
  'Racket Boys',
  'Twenty Five Twenty One',
  'Our Beloved Summer',
  'Business Proposal',
  'What\'s Wrong with Secretary Kim',
  'Her Private Life',
  'Touch Your Heart',
  'Goblin',
  'Guardian: The Lonely and Great God',
  'The King: Eternal Monarch',
  'Crash Landing on You',
  'Itaewon Class',
  'Vincenzo',
  'The Devil Judge',
  'Beyond Evil',
  'Mouse',
  'Flower of Evil',
  'The Penthouse',
  'Sky Castle',
  'The World of the Married',
  'Mine',
  'Reflection of You',
  'The Last Empress',
  'Graceful Family',
  'VIP',
  'Secret Boutique',
  'Eve',
  'Remarriage & Desires',
  'The Glory',
  'Little Women',
  'Reborn Rich',
  'The Good Bad Mother',
  'Doctor Cha',
  'The Real Has Come',
  'King the Land',
  'See You in My 19th Life',
  'Destined with You',
  'My Lovely Liar',
  'The Killing Vote',
  'Strong Girl Nam-soon',
  'Castaway Diva',
  'Welcome to Samdal-ri',
  'My Demon',
  'Gyeongseong Creature',
  'Death\'s Game',
  'A Shop for Killers',
  'Marry My Husband',
  'Flex X Cop',
  'Queen of Tears',
  'Wonderful World',
  'The Midnight Studio',
  'Lovely Runner',
  'The Atypical Family',
  'The 8 Show',
  'Hierarchy',
  'Squid Game: The Challenge',
  'Single\'s Inferno',
  'Physical: 100',
  'The Devil\'s Plan',
  'Zombieverse',
  'Siren: Survive the Island'
];

async function searchAndImportManga() {
  const existingTitles = getExistingMangaTitles();
  console.log(`Found ${existingTitles.size} existing manga titles`);
  
  const newMangaToImport = [];
  
  console.log('Searching for new manga, manhwa, and webtoons to import...');
  
  for (const mangaTitle of mangaToSearch) {
    // Skip if already exists
    if (existingTitles.has(mangaTitle.toLowerCase().trim())) {
      console.log(`Skipping "${mangaTitle}" - already exists`);
      continue;
    }
    
    try {
      console.log(`Searching for: ${mangaTitle}`);
      
      // Search for manga using MangaMD API directly
      const searchUrl = `https://api.mangadex.org/manga?title=${encodeURIComponent(mangaTitle)}&limit=5&includes[]=cover_art&includes[]=author&includes[]=artist`;
      const response = await fetch(searchUrl);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          // Find the best match (exact title match or closest)
          let bestMatch = data.data[0];
          
          for (const result of data.data) {
            const resultTitle = result.attributes.title.en || result.attributes.title.ja || Object.values(result.attributes.title)[0];
            if (resultTitle.toLowerCase().includes(mangaTitle.toLowerCase()) || 
                mangaTitle.toLowerCase().includes(resultTitle.toLowerCase())) {
              bestMatch = result;
              break;
            }
          }
          
          // Get cover image
          let coverUrl = null;
          if (bestMatch.relationships) {
            const coverRel = bestMatch.relationships.find(rel => rel.type === 'cover_art');
            if (coverRel) {
              coverUrl = `https://uploads.mangadex.org/covers/${bestMatch.id}/${coverRel.attributes.fileName}`;
            }
          }
          
          // Get authors and artists
          const authors = [];
          const artists = [];
          if (bestMatch.relationships) {
            bestMatch.relationships.forEach(rel => {
              if (rel.type === 'author') {
                authors.push(rel.attributes.name);
              } else if (rel.type === 'artist') {
                artists.push(rel.attributes.name);
              }
            });
          }
          
          // Get tags
          const tags = [];
          if (bestMatch.attributes.tags) {
            bestMatch.attributes.tags.forEach(tag => {
              const tagName = tag.attributes.name.en || tag.attributes.name.ja || Object.values(tag.attributes.name)[0];
              tags.push(tagName);
            });
          }
          
          const mangaData = {
            id: bestMatch.id,
            title: bestMatch.attributes.title.en || bestMatch.attributes.title.ja || Object.values(bestMatch.attributes.title)[0],
            description: bestMatch.attributes.description.en || bestMatch.attributes.description.ja || Object.values(bestMatch.attributes.description)[0] || '',
            status: bestMatch.attributes.status,
            year: bestMatch.attributes.year,
            contentRating: bestMatch.attributes.contentRating,
            coverUrl: coverUrl,
            authors: authors,
            artists: artists,
            tags: tags,
            altTitles: bestMatch.attributes.altTitles || []
          };
          
          console.log(`Found match: "${mangaData.title}"`);
          newMangaToImport.push(mangaData);
          
          // Limit to prevent overwhelming the system
          if (newMangaToImport.length >= 150) {
            console.log('Reached limit of 150 new manga to import');
            break;
          }
        } else {
          console.log(`No results found for: ${mangaTitle}`);
        }
      } else {
        console.log(`Search failed for: ${mangaTitle} (${response.status})`);
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error searching for "${mangaTitle}":`, error.message);
    }
  }
  
  if (newMangaToImport.length === 0) {
    console.log('No new manga found to import');
    return;
  }
  
  console.log(`\nFound ${newMangaToImport.length} new manga to import:`);
  newMangaToImport.forEach((manga, index) => {
    console.log(`${index + 1}. ${manga.title}`);
  });
  
  // Import the new manga
  console.log('\nStarting import process...');
  
  let importedCount = 0;
  let errorCount = 0;
  
  for (const mangaData of newMangaToImport) {
    try {
      const folderPath = await createMangaFolderAndMetadata(mangaData);
      console.log(`✅ Imported: ${mangaData.title} -> ${folderPath}`);
      importedCount++;
    } catch (error) {
      console.error(`❌ Failed to import: ${mangaData.title} - ${error.message}`);
      errorCount++;
    }
  }
  
  console.log(`\nImport Results:`);
  console.log(`✅ Imported: ${importedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

// Run the script
searchAndImportManga().catch(console.error);
