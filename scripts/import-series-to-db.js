/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

const SERIES_DIR = path.resolve(__dirname, '..', 'series');

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

async function main() {
  if (!fs.existsSync(SERIES_DIR)) {
    console.error('Series directory not found:', SERIES_DIR);
    process.exit(1);
  }

  const slugs = fs.readdirSync(SERIES_DIR).filter((d) => {
    const full = path.join(SERIES_DIR, d);
    return fs.statSync(full).isDirectory();
  });

  console.log(`Found ${slugs.length} series folders.`);

  // Get the first admin user as the creator
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!adminUser) {
    console.error('No admin user found. Please create an admin user first.');
    process.exit(1);
  }

  for (const folderName of slugs) {
    const metaPath = path.join(SERIES_DIR, folderName, 'metadata.json');
    if (!fs.existsSync(metaPath)) {
      console.warn(`No metadata.json for ${folderName}, skipping.`);
      continue;
    }

    const raw = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    const title = raw.title || folderName;
    const slug = generateSlug(title);
    const description = raw.description || null;
    // Check if cover image exists and set proper path
    let coverImage = null;
    if (raw.cover || raw.coverImage) {
      const coverFileName = raw.cover || raw.coverImage;
      const coverPath = path.join(SERIES_DIR, folderName, coverFileName);
      if (fs.existsSync(coverPath)) {
        coverImage = `/api/series-covers/${encodeURIComponent(folderName)}/${coverFileName}`;
      }
    }
    const authors = Array.isArray(raw.authors) ? raw.authors.join(', ') : raw.author || null;
    const tags = Array.isArray(raw.tags) ? raw.tags.join(',') : raw.tags || null;
    const mangaMDId = raw.id || null;
    const mangaMDStatus = raw.status || null;
    const contentRating = raw.contentRating || 'safe';

    // Always create new series (don't update existing ones)
    await prisma.series.create({
      data: { 
        title, 
        description, 
        coverImage, 
        authors, 
        tags,
        mangaMDId,
        mangaMDStatus,
        contentRating,
        isImported: true,
        isPublished: true,
        creatorId: adminUser.id
      }
    });
    console.log(`🆕 Created: ${title}`);
  }

  console.log('Import complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
