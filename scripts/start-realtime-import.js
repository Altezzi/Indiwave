const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting real-time import system...');

// Start the file watcher
const watcher = spawn('node', [path.join(__dirname, 'file-watcher.js')], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..')
});

watcher.on('error', (error) => {
  console.error('❌ Failed to start file watcher:', error);
  process.exit(1);
});

watcher.on('exit', (code) => {
  console.log(`📊 File watcher exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down real-time import system...');
  watcher.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down real-time import system...');
  watcher.kill('SIGTERM');
});

console.log('✅ Real-time import system started!');
console.log('👀 Watching for changes in the series folder...');
console.log('🛑 Press Ctrl+C to stop');
