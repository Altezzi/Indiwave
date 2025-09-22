import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testMangaDexCovers() {
  try {
    console.log('🧪 Testing MangaDex cover API...');
    
    // Get a series with MangaDex ID
    const series = await prisma.series.findFirst({
      where: {
        mangaMDId: {
          not: null
        }
      },
      select: {
        id: true,
        title: true,
        mangaMDId: true,
        coverImage: true
      }
    });
    
    if (!series) {
      console.log('❌ No series with MangaDex ID found');
      return;
    }
    
    console.log(`\n📖 Testing with: ${series.title}`);
    console.log(`   MangaDex ID: ${series.mangaMDId}`);
    console.log(`   Current cover URL: ${series.coverImage}`);
    
    // Test the MangaDex cover API
    const coverApiUrl = `https://api.mangadex.org/cover?manga[]=${series.mangaMDId}&limit=100`;
    console.log(`\n🔍 Fetching covers from: ${coverApiUrl}`);
    
    try {
      const response = await fetch(coverApiUrl);
      const data = await response.json();
      
      if (data.result === 'ok' && data.data.length > 0) {
        console.log(`   ✅ Found ${data.data.length} covers`);
        
        const cover = data.data[0];
        console.log(`   📋 Cover data:`, {
          id: cover.id,
          fileName: cover.attributes.fileName,
          volume: cover.attributes.volume,
          description: cover.attributes.description
        });
        
        // Test the correct cover URL format
        const baseUrl = 'https://uploads.mangadex.org/covers';
        const testUrls = [
          `${baseUrl}/${series.mangaMDId}/${cover.attributes.fileName}`,
          `${baseUrl}/${cover.id}/${cover.attributes.fileName}`,
          `${baseUrl}/${series.mangaMDId}/${cover.attributes.fileName}.512.jpg`,
          `${baseUrl}/${cover.id}/${cover.attributes.fileName}.512.jpg`
        ];
        
        console.log('\n🧪 Testing cover URL formats:');
        for (const testUrl of testUrls) {
          try {
            console.log(`\n   🧪 Testing: ${testUrl}`);
            const coverResponse = await fetch(testUrl);
            if (coverResponse.ok) {
              console.log(`   ✅ Status: ${coverResponse.status} - Working!`);
              console.log(`   📏 Content-Type: ${coverResponse.headers.get('content-type')}`);
              console.log(`   📏 Content-Length: ${coverResponse.headers.get('content-length')}`);
              
              // Update the database with the working URL
              await prisma.series.update({
                where: { id: series.id },
                data: { coverImage: testUrl }
              });
              console.log(`   💾 Updated database with working URL!`);
              break;
            } else {
              console.log(`   ❌ Status: ${coverResponse.status}`);
            }
          } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
          }
        }
        
      } else {
        console.log(`   ❌ No covers found or API error: ${data.result}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error fetching covers: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing MangaDex covers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMangaDexCovers();
