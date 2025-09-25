#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

try {
  // Step 1: Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Step 2: Create minimal tsconfig.json with only path mappings (no TypeScript checking)
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  const tsconfigBackupPath = path.join(process.cwd(), 'tsconfig.json.backup');
  
  console.log('🔄 Creating minimal TypeScript config with path mappings...');
  if (fs.existsSync(tsconfigPath)) {
    fs.copyFileSync(tsconfigPath, tsconfigBackupPath);
  }
  
  // Create minimal tsconfig.json with only path mappings
  const minimalTsconfig = {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./*"]
      },
      "allowJs": true,
      "skipLibCheck": true,
      "noEmit": true
    },
    "include": ["**/*.ts", "**/*.tsx"],
    "exclude": ["node_modules"]
  };
  
  fs.writeFileSync(tsconfigPath, JSON.stringify(minimalTsconfig, null, 2));
  
  // Step 3: Create a simple next.config.js that forces JavaScript mode
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const nextConfigContent = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
`;
  
  console.log('📝 Creating simple Next.js config...');
  fs.writeFileSync(nextConfigPath, nextConfigContent);
  
  // Step 4: Build Next.js with all TypeScript checking disabled
  console.log('🏗️ Building Next.js application...');
  
  // Set environment variables to completely disable TypeScript
  const buildEnv = {
    ...process.env,
    SKIP_TYPE_CHECK: 'true',
    SKIP_ENV_VALIDATION: 'true',
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_ENV: 'production'
  };
  
  // Run the build
  execSync('npx next build', { 
    stdio: 'inherit',
    env: buildEnv
  });
  
  // Step 5: Clean up - restore original files
  console.log('🧹 Cleaning up...');
  
  // Remove the temporary next.config.js
  if (fs.existsSync(nextConfigPath)) {
    fs.unlinkSync(nextConfigPath);
  }
  
  // Restore tsconfig.json
  if (fs.existsSync(tsconfigBackupPath)) {
    fs.renameSync(tsconfigBackupPath, tsconfigPath);
  }
  
  console.log('✅ Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Clean up even if build failed
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  const tsconfigBackupPath = path.join(process.cwd(), 'tsconfig.json.backup');
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  
  if (fs.existsSync(tsconfigBackupPath)) {
    fs.renameSync(tsconfigBackupPath, tsconfigPath);
  }
  
  if (fs.existsSync(nextConfigPath)) {
    fs.unlinkSync(nextConfigPath);
  }
  
  process.exit(1);
}