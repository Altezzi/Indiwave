#!/usr/bin/env node

/**
 * Vercel Build Optimization Script
 * This script optimizes the build process for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build optimization...');

// Create optimized package.json for Vercel
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add Vercel-specific scripts if they don't exist
if (!packageJson.scripts['vercel-build']) {
  packageJson.scripts['vercel-build'] = 'prisma generate && next build';
}

// Optimize dependencies for Vercel
if (!packageJson.engines) {
  packageJson.engines = {
    node: '>=20.0.0',
    npm: '>=9.0.0'
  };
}

// Write optimized package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('✅ Package.json optimized for Vercel');

// Create Vercel-specific environment file
const envContent = `# Vercel Environment Variables
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=4096
`;

fs.writeFileSync(path.join(process.cwd(), '.env.vercel'), envContent);

console.log('✅ Vercel environment file created');

// Ensure Prisma schema is optimized
const prismaSchemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (fs.existsSync(prismaSchemaPath)) {
  console.log('✅ Prisma schema found');
} else {
  console.log('⚠️  Prisma schema not found - database features may not work');
}

console.log('🎉 Vercel build optimization complete!');
console.log('📋 Next steps:');
console.log('1. Push changes to GitHub');
console.log('2. Vercel will automatically deploy');
console.log('3. Set environment variables in Vercel dashboard');
console.log('4. Test your deployment');
