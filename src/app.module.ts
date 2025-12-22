
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CouponsModule } from './coupons/coupons.module';
import { RedemptionsModule } from './redemptions/redemptions.module';
import { ReferralsModule } from './referrals/referrals.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CustomersModule } from './customers/customers.module';
import { AuditlogsModule } from './auditlogs/auditlogs.module';
import { TeammembersModule } from './teammembers/teammembers.module';
import { AdminModule } from './admin/admin.module';
import { MerchantsModule } from './merchants/merchants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    CouponsModule,
    RedemptionsModule,
    ReferralsModule,
    AnalyticsModule,
    CustomersModule,
    AuditlogsModule,
    TeammembersModule,
    AdminModule,
    MerchantsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
