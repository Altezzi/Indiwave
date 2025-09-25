import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

async function main() {
  console.log('Adding slugs to existing series...');
  
  const series = await prisma.series.findMany({
    where: { slug: null }
  });

  for (const s of series) {
    const slug = generateSlug(s.title);
    let finalSlug = slug;
    let counter = 1;
    
    // Ensure unique slug
    while (await prisma.series.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    
    await prisma.series.update({
      where: { id: s.id },
      data: { slug: finalSlug }
    });
    
    console.log(`Added slug "${finalSlug}" to "${s.title}"`);
  }
  
  console.log('Slug generation complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
