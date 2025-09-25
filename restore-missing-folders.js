const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function restoreMissingFolders() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Restoring missing series folders...');
    
    // Get all series from database
    const dbSeries = await prisma.series.findMany({
      select: { title: true }
    });
    
    const seriesDir = path.join(process.cwd(), 'series');
    const existingFolders = fs.readdirSync(seriesDir).filter(item => {
      const itemPath = path.join(seriesDir, item);
      return fs.statSync(itemPath).isDirectory();
    });
    
    let restoredCount = 0;
    let notFoundCount = 0;
    
    for (const series of dbSeries) {
      if (!existingFolders.includes(series.title)) {
        // Try to find a similar folder
        const similarFolder = findSimilarFolder(series.title, existingFolders);
        
        if (similarFolder) {
          const sourcePath = path.join(seriesDir, similarFolder);
          const targetPath = path.join(seriesDir, series.title);
          
          try {
            // Create a symbolic link (Windows supports this)
            if (process.platform === 'win32') {
              // Use Windows mklink command
              const { execSync } = require('child_process');
              execSync(`mklink /D "${targetPath}" "${sourcePath}"`, { stdio: 'ignore' });
            } else {
              // Use fs.symlink for Unix systems
              fs.symlinkSync(sourcePath, targetPath, 'dir');
            }
            
            restoredCount++;
            console.log(`✅ Restored: "${series.title}" -> "${similarFolder}"`);
          } catch (error) {
            console.log(`❌ Failed to restore: "${series.title}" (${error.message})`);
            notFoundCount++;
          }
        } else {
          console.log(`❌ No similar folder found: "${series.title}"`);
          notFoundCount++;
        }
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`- Restored folders: ${restoredCount}`);
    console.log(`- Not found: ${notFoundCount}`);
    
    if (restoredCount > 0) {
      console.log(`\n🎉 Successfully restored ${restoredCount} missing folders!`);
      console.log('The series should now be accessible in the file system.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function findSimilarFolder(dbTitle, existingFolders) {
  // Remove colons and normalize the title
  const normalizedDbTitle = dbTitle.replace(/:/g, '').replace(/\s+/g, ' ').trim();
  
  // Try exact match first (without colons)
  let match = existingFolders.find(folder => 
    folder.replace(/:/g, '').replace(/\s+/g, ' ').trim() === normalizedDbTitle
  );
  
  if (match) return match;
  
  // Try partial match (first 10 characters)
  const dbPrefix = normalizedDbTitle.substring(0, 10).toLowerCase();
  match = existingFolders.find(folder => 
    folder.toLowerCase().startsWith(dbPrefix)
  );
  
  if (match) return match;
  
  // Try reverse match (folder name in database title)
  match = existingFolders.find(folder => 
    normalizedDbTitle.toLowerCase().includes(folder.toLowerCase().substring(0, 10))
  );
  
  if (match) return match;
  
  // Special cases for known mappings
  const specialMappings = {
    'Ajin: Demi-Human': 'Ajin',
    'Demon Slayer: Kimetsu no Yaiba': 'Demon Slayer Kimetsu no Yaiba',
    'Dr.STONE': 'Dr. Stone',
    'FAIRY TAIL': 'Fairy Tail',
    'HUNTER x HUNTER': 'Hunter x Hunter',
    'InuYasha': 'Inuyasha',
    'ONE PIECE': 'One Piece',
    'One-Punch Man (Fan Colored)': 'One Punch Man',
    'Sword Art Online: Calibur': 'Sword Art Online',
    'That Time I Got Reincarnated as a Slime (Official Colored Vertical)': 'That Time I Got Reincarnated as a Slime',
    'Kage no Jitsuryokusha ni Naritakute!': 'The Eminence in Shadow',
    'Tate no Yuusha No Nariagari - Mobile Game Short Comics': 'The Rising of the Shield Hero',
    'Yu★Yu★Hakusho': 'Yu Yu Hakusho'
  };
  
  return specialMappings[dbTitle] && existingFolders.includes(specialMappings[dbTitle]) 
    ? specialMappings[dbTitle] 
    : null;
}

restoreMissingFolders();


