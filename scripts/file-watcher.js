const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// Configuration
const SERIES_PATH = path.join(__dirname, '..', 'series');
const API_URL = process.env.API_URL || 'http://localhost:3000/api/admin/auto-import';
const WATCH_INTERVAL = 5000; // 5 seconds debounce

let lastTrigger = 0;
let timeoutId = null;

console.log('👀 Starting file watcher for series folder...');
console.log(`📁 Watching: ${SERIES_PATH}`);
console.log(`🔗 API URL: ${API_URL}`);

// Function to trigger import
async function triggerImport() {
  const now = Date.now();
  
  // Debounce: don't trigger more than once every 5 seconds
  if (now - lastTrigger < WATCH_INTERVAL) {
    console.log('⏳ Import already triggered recently, skipping...');
    return;
  }

  lastTrigger = now;
  console.log('🔄 Triggering auto-import...');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Import successful: ${result.imported} new, ${result.updated} updated`);
    } else {
      console.error('❌ Import failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Failed to trigger import:', error.message);
  }
}

// Watch for changes in the series folder
const watcher = chokidar.watch(SERIES_PATH, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true, // Don't trigger on startup
  depth: 2 // Watch subdirectories
});

watcher
  .on('add', (filePath) => {
    console.log(`📁 New file added: ${path.relative(SERIES_PATH, filePath)}`);
    scheduleImport();
  })
  .on('change', (filePath) => {
    console.log(`📝 File changed: ${path.relative(SERIES_PATH, filePath)}`);
    scheduleImport();
  })
  .on('unlink', (filePath) => {
    console.log(`🗑️ File removed: ${path.relative(SERIES_PATH, filePath)}`);
    scheduleImport();
  })
  .on('addDir', (dirPath) => {
    console.log(`📂 New directory: ${path.relative(SERIES_PATH, dirPath)}`);
    scheduleImport();
  })
  .on('unlinkDir', (dirPath) => {
    console.log(`🗂️ Directory removed: ${path.relative(SERIES_PATH, dirPath)}`);
    scheduleImport();
  })
  .on('error', (error) => {
    console.error('❌ Watcher error:', error);
  });

// Debounced import trigger
function scheduleImport() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  
  timeoutId = setTimeout(() => {
    triggerImport();
  }, WATCH_INTERVAL);
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down file watcher...');
  watcher.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down file watcher...');
  watcher.close();
  process.exit(0);
});

console.log('✅ File watcher started successfully!');
console.log('💡 Add new manga to the series folder and they will be automatically imported');
console.log('🛑 Press Ctrl+C to stop');
