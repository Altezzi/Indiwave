import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a test admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@indiwave.com' },
    update: {},
    create: {
      accountId: 1,
      email: 'admin@indiwave.com',
      password: hashedPassword,
      name: 'Admin User',
      username: 'admin',
      role: 'ADMIN',
      isCreator: true,
    },
  })

  // Create a test regular user
  const userPassword = await bcrypt.hash('user123', 12)
  
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@indiwave.com' },
    update: {},
    create: {
      accountId: 2,
      email: 'user@indiwave.com',
      password: userPassword,
      name: 'Regular User',
      username: 'regularuser',
      role: 'USER',
      isCreator: false,
    },
  })

  // Create a test creator
  const creatorPassword = await bcrypt.hash('creator123', 12)
  
  const creatorUser = await prisma.user.upsert({
    where: { email: 'creator@indiwave.com' },
    update: {},
    create: {
      accountId: 3,
      email: 'creator@indiwave.com',
      password: creatorPassword,
      name: 'Creator User',
      username: 'creator',
      role: 'CREATOR',
      isCreator: true,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('Test users created:')
  console.log('- Admin: admin@indiwave.com / admin123')
  console.log('- User: user@indiwave.com / user123')
  console.log('- Creator: creator@indiwave.com / creator123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
