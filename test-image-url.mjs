// Using built-in fetch

async function testImageUrl() {
  try {
    const url = 'http://localhost:3000/covers/cmfum6efv0j45n67gozuylh9h.jpg';
    console.log(`Testing URL: ${url}`);
    
    const response = await fetch(url);
    console.log(`Status: ${response.status}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const buffer = await response.buffer();
      console.log(`Image size: ${buffer.length} bytes`);
      console.log(`Content-Type: ${response.headers.get('content-type')}`);
    } else {
      console.log(`Error: ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('Error testing image URL:', error);
  }
}

testImageUrl();
