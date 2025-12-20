"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcrypt"));
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
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
//# sourceMappingURL=seed.js.map