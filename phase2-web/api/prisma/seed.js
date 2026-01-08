const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default admin user
  const adminEmail = 'admin@afrocat-sports.com';
  
  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        memberId: 'AFC-2024-0000',
        email: adminEmail,
        name: 'System Administrator',
        role: 'ADMIN',
        status: 'APPROVED',
        termsAccepted: true,
        approvedAt: new Date(),
        approvedBy: 'SYSTEM'
      }
    });
    console.log('Created admin user:', admin.email);
  } else {
    console.log('Admin user already exists');
  }

  // Create sample team
  const team = await prisma.team.upsert({
    where: { name: 'Team A' },
    update: {},
    create: {
      name: 'Team A',
      coachId: null
    }
  });
  console.log('Created/updated team:', team.name);

  // Create sample player
  const samplePlayer = await prisma.user.upsert({
    where: { email: 'player@example.com' },
    update: {},
    create: {
      memberId: 'AFC-2024-0001',
      email: 'player@example.com',
      name: 'Sample Player',
      role: 'PLAYER',
      status: 'APPROVED',
      termsAccepted: true,
      approvedAt: new Date(),
      approvedBy: 'SYSTEM'
    }
  });

  // Create membership
  await prisma.membership.upsert({
    where: {
      userId_teamId: {
        userId: samplePlayer.id,
        teamId: team.id
      }
    },
    update: {},
    create: {
      userId: samplePlayer.id,
      teamId: team.id,
      jerseyNumber: 10
    }
  });
  console.log('Created sample player and membership');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

