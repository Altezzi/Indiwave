/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERIES_DIR = path.resolve(__dirname, '..', 'series');

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

  for (const slug of slugs) {
    const metaPath = path.join(SERIES_DIR, slug, 'metadata.json');
    if (!fs.existsSync(metaPath)) {
      console.warn(`No metadata.json for slug=${slug}, skipping.`);
      continue;
    }

    const raw = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    const title = raw.title || slug;
    const description = raw.description || null;
    const coverImage = raw.cover || raw.coverImage || null;
    const authors = Array.isArray(raw.authors) ? raw.authors.join(', ') : raw.author || null;
    const tags = Array.isArray(raw.tags) ? raw.tags.join(',') : raw.tags || null;
    const mangaMDId = raw.id || null;
    const mangaMDStatus = raw.status || null;
    const contentRating = raw.contentRating || 'safe';

    const series = await prisma.series.upsert({
      where: { slug },
      update: { 
        title, 
        description, 
        coverImage, 
        authors, 
        tags,
        mangaMDId,
        mangaMDStatus,
        contentRating,
        isImported: true,
        isPublished: true // Auto-publish imported series
      },
      create: { 
        slug, 
        title, 
        description, 
        coverImage, 
        authors, 
        tags,
        mangaMDId,
        mangaMDStatus,
        contentRating,
        isImported: true,
        isPublished: true, // Auto-publish imported series
        creatorId: adminUser.id
      },
    });

    // chapters: try chapters.json or raw.chapters
    const chaptersPath = path.join(SERIES_DIR, slug, 'chapters.json');
    let chapters = [];

    if (fs.existsSync(chaptersPath)) {
      chapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf-8'));
    } else if (Array.isArray(raw.chapters)) {
      chapters = raw.chapters;
    }

    if (chapters.length) {
      // naive sync: delete & re-add (simple for v1)
      await prisma.chapter.deleteMany({ where: { seriesId: series.id } });

      for (const c of chapters) {
        const number = Number(c.number ?? c.index ?? c.id ?? 0);
        await prisma.chapter.create({
          data: {
            seriesId: series.id,
            chapterNumber: Number.isFinite(number) ? number : 0,
            title: c.title ?? `Chapter ${number}`,
            pages: JSON.stringify(c.pages || []),
            isPublished: true,
            creatorId: adminUser.id
          },
        });
      }
    }

    console.log(`Imported: ${slug} (${title}) - ${chapters.length} chapters`);
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
