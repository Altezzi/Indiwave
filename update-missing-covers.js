const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function updateMissingCovers() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Updating database with newly added cover images...');
    
    // Get all series from database that don't have covers
    const seriesWithoutCovers = await prisma.series.findMany({
      where: { coverImage: null },
      select: { id: true, title: true }
    });
    
    const seriesDir = path.join(process.cwd(), 'series');
    let updatedCount = 0;
    let stillMissingCount = 0;
    
    for (const series of seriesWithoutCovers) {
      const seriesFolder = path.join(seriesDir, series.title);
      
      if (fs.existsSync(seriesFolder)) {
        // Check if folder has any cover files
        const coverFiles = fs.readdirSync(seriesFolder).filter(file => 
          file.toLowerCase().startsWith('cover.') && 
          ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
        );
        
        if (coverFiles.length > 0) {
          const coverFileName = coverFiles[0];
          const coverImagePath = `/api/series-covers/${encodeURIComponent(series.title)}/${coverFileName}`;
          
          // Update the series with the correct cover image path
          await prisma.series.update({
            where: { id: series.id },
            data: { coverImage: coverImagePath }
          });
          
          updatedCount++;
          console.log(`✅ Updated: ${series.title} -> ${coverFileName}`);
        } else {
          stillMissingCount++;
          console.log(`❌ Still missing: ${series.title}`);
        }
      } else {
        stillMissingCount++;
        console.log(`❌ Folder not found: ${series.title}`);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`- Updated with covers: ${updatedCount} series`);
    console.log(`- Still missing covers: ${stillMissingCount} series`);
    
    // Check final count
    const finalWithCovers = await prisma.series.count({
      where: { coverImage: { not: null } }
    });
    
    const finalWithoutCovers = await prisma.series.count({
      where: { coverImage: null }
    });
    
    console.log(`- Final count with covers: ${finalWithCovers}`);
    console.log(`- Final count without covers: ${finalWithoutCovers}`);
    
    if (updatedCount > 0) {
      console.log(`\n🎉 Successfully updated ${updatedCount} series with cover images!`);
      console.log('The covers should now be visible on your website.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateMissingCovers();

