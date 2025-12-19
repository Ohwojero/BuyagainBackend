import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  // Create a sample merchant
  const merchant = await prisma.merchant.upsert({
    where: { email: 'test@merchant.com' },
    update: {},
    create: {
      businessName: 'Test Merchant',
      email: 'test@merchant.com',
      phone: '+1234567890',
      businessType: 'Retail',
      address: '123 Test St',
    },
  });

  // Create a user for the merchant
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@merchant.com' },
    update: {},
    create: {
      email: 'test@merchant.com',
      password: hashedPassword,
      role: 'MERCHANT',
      merchantId: merchant.id,
    },
  });

  // Create sample coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'COUPON1',
        type: 'DISCOUNT',
        status: 'ACTIVE',
        value: 10,
        valueType: 'PERCENTAGE',
        quantity: 100,
        merchantId: merchant.id,
      },
      {
        code: 'COUPON2',
        type: 'DISCOUNT',
        status: 'ACTIVE',
        value: 5,
        valueType: 'FIXED',
        quantity: 50,
        merchantId: merchant.id,
      },
    ],
  });

  // Create sample redemptions
  const coupons = await prisma.coupon.findMany({ where: { merchantId: merchant.id } });
  await prisma.redemption.createMany({
    data: [
      {
        status: 'COMPLETED',
        discountAmount: 10,
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        merchantId: merchant.id,
        couponId: coupons[0].id,
      },
      {
        status: 'COMPLETED',
        discountAmount: 5,
        customerName: 'Jane Smith',
        customerPhone: '+0987654321',
        merchantId: merchant.id,
        couponId: coupons[1].id,
      },
    ],
  });

  // Create sample referrals
  await prisma.referral.createMany({
    data: [
      {
        referrerName: 'Alice',
        referrerPhone: '+1111111111',
        referredName: 'Bob',
        referredPhone: '+2222222222',
        rewardAmount: 5,
        isCompleted: true,
        merchantId: merchant.id,
      },
      {
        referrerName: 'Charlie',
        referrerPhone: '+3333333333',
        referredName: 'David',
        referredPhone: '+4444444444',
        rewardAmount: 10,
        isCompleted: false,
        merchantId: merchant.id,
      },
    ],
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
