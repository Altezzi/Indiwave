import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findAdminUser() {
  try {
    console.log('🔍 Finding admin users...');
    
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, name: true }
    });
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found!');
      console.log('💡 You may need to create an admin user first.');
    } else {
      console.log('✅ Admin users found:');
      adminUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ID: ${user.id}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Name: ${user.name || 'No name'}`);
        console.log('');
      });
      
      // Use the first admin user as default
      const firstAdmin = adminUsers[0];
      console.log(`🎯 Recommended CREATOR_ID: ${firstAdmin.id}`);
    }
    
  } catch (error) {
    console.error('❌ Error finding admin users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findAdminUser();
