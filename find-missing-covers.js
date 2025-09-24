const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function findMissingCovers() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Finding series with cover files that are missing from database...');
    
    // Get all series from database
    const dbSeries = await prisma.series.findMany({
      select: { title: true, coverImage: true }
    });
    
    const dbSeriesTitles = new Set(dbSeries.map(s => s.title));
    
    const seriesDir = path.join(process.cwd(), 'series');
    const seriesFolders = fs.readdirSync(seriesDir).filter(item => {
      const itemPath = path.join(seriesDir, item);
      return fs.statSync(itemPath).isDirectory();
    });
    
    console.log(`Total series folders: ${seriesFolders.length}`);
    console.log(`Total series in database: ${dbSeries.length}`);
    
    let missingFromDb = [];
    let hasCovers = [];
    let noCovers = [];
    
    for (const folderName of seriesFolders) {
      const seriesFolder = path.join(seriesDir, folderName);
      
      // Check if this series is in the database
      if (!dbSeriesTitles.has(folderName)) {
        // Check if it has cover files
        const coverFiles = fs.readdirSync(seriesFolder).filter(file => 
          file.toLowerCase().startsWith('cover.') && 
          ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
        );
        
        if (coverFiles.length > 0) {
          missingFromDb.push({
            folder: folderName,
            cover: coverFiles[0]
          });
        }
      } else {
        // Series is in database, check if it has covers
        const coverFiles = fs.readdirSync(seriesFolder).filter(file => 
          file.toLowerCase().startsWith('cover.') && 
          ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
        );
        
        if (coverFiles.length > 0) {
          hasCovers.push(folderName);
        } else {
          noCovers.push(folderName);
        }
      }
    }
    
    console.log(`\n📊 Analysis:`);
    console.log(`- Series in database with covers: ${hasCovers.length}`);
    console.log(`- Series in database without covers: ${noCovers.length}`);
    console.log(`- Series folders with covers but NOT in database: ${missingFromDb.length}`);
    
    if (missingFromDb.length > 0) {
      console.log(`\n🔍 Series with covers but missing from database:`);
      missingFromDb.slice(0, 20).forEach(item => {
        console.log(`- ${item.folder} (${item.cover})`);
      });
      
      if (missingFromDb.length > 20) {
        console.log(`... and ${missingFromDb.length - 20} more`);
      }
    }
    
    // Check some specific series that were showing 404 errors
    const problematicSeries = [
      "Yumi's Cells",
      "Wotaku ni Koi wa Muzukashii", 
      "Old Boy",
      "Game Over Squad",
      "Samurai Champloo",
      "Mashle Magic and Muscles"
    ];
    
    console.log(`\n🔍 Checking problematic series:`);
    for (const seriesName of problematicSeries) {
      const seriesFolder = path.join(seriesDir, seriesName);
      if (fs.existsSync(seriesFolder)) {
        const coverFiles = fs.readdirSync(seriesFolder).filter(file => 
          file.toLowerCase().startsWith('cover.') && 
          ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
        );
        
        console.log(`- ${seriesName}: ${coverFiles.length > 0 ? coverFiles[0] : 'NO COVER'}`);
      } else {
        console.log(`- ${seriesName}: FOLDER NOT FOUND`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findMissingCovers();

