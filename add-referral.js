const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:121212@localhost:5432/devdb';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function addReferral() {
  try {
    // First, get or create a merchant
    let merchant = await prisma.merchant.findFirst();
    if (!merchant) {
      merchant = await prisma.merchant.create({
        data: {
          businessName: 'Test Merchant',
          email: 'test@merchant.com',
          phone: '+1234567890',
        },
      });
    }

    // Check if referral already exists
    const existingReferral = await prisma.referral.findUnique({
      where: { code: 'FLCTK7I0' },
    });

    if (existingReferral) {
      console.log('Referral code FLCTK7I0 already exists');
      return;
    }

    // Create the referral
    const referral = await prisma.referral.create({
      data: {
        code: 'FLCTK7I0',
        referrerName: 'Test Referrer',
        referrerPhone: '+5555555555',
        rewardAmount: 5,
        isCompleted: false,
        merchantId: merchant.id,
      },
    });

    console.log('Referral created successfully:', referral);
  } catch (error) {
    console.error('Error creating referral:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addReferral();
