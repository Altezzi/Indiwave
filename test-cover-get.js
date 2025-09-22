import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCoverGet() {
  try {
    console.log('🧪 Testing cover URLs with GET request...');
    
    // Get one series with cover image
    const series = await prisma.series.findFirst({
      where: {
        coverImage: {
          not: null,
          not: '/placeholder.svg'
        }
      },
      select: {
        id: true,
        title: true,
        coverImage: true
      }
    });
    
    if (!series) {
      console.log('❌ No series with cover images found');
      return;
    }
    
    console.log(`\n📖 Testing: ${series.title}`);
    console.log(`   URL: ${series.coverImage}`);
    
    try {
      const response = await fetch(series.coverImage);
      if (response.ok) {
        console.log(`   ✅ Status: ${response.status} - Image accessible`);
        console.log(`   📏 Content-Type: ${response.headers.get('content-type')}`);
        console.log(`   📏 Content-Length: ${response.headers.get('content-length')}`);
      } else {
        console.log(`   ❌ Status: ${response.status} - Image not accessible`);
        const text = await response.text();
        console.log(`   📄 Response: ${text.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    // Test the correct MangaDex cover URL format
    console.log('\n🔍 Testing correct MangaDex cover URL format...');
    
    // Extract the cover ID and filename from the current URL
    const urlParts = series.coverImage.split('/');
    const coverId = urlParts[urlParts.length - 2];
    const filename = urlParts[urlParts.length - 1];
    
    console.log(`   Cover ID: ${coverId}`);
    console.log(`   Filename: ${filename}`);
    
    // Test different URL formats
    const testUrls = [
      `https://uploads.mangadex.org/covers/${coverId}/${filename}`,
      `https://uploads.mangadex.org/covers/${coverId}/${filename.replace('.large.jpg', '.jpg')}`,
      `https://uploads.mangadex.org/covers/${coverId}/${filename.replace('.large.jpg', '.512.jpg')}`,
      `https://uploads.mangadex.org/covers/${coverId}/${filename.replace('.large.jpg', '.256.jpg')}`
    ];
    
    for (const testUrl of testUrls) {
      try {
        console.log(`\n   🧪 Testing: ${testUrl}`);
        const response = await fetch(testUrl);
        if (response.ok) {
          console.log(`   ✅ Status: ${response.status} - Working!`);
          console.log(`   📏 Content-Type: ${response.headers.get('content-type')}`);
          break;
        } else {
          console.log(`   ❌ Status: ${response.status}`);
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing cover URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCoverGet();
