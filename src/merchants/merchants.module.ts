import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { MerchantsController } from './merchants.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [MerchantsController],
  providers: [MerchantsService],
  imports: [PrismaModule],
  exports: [MerchantsService],
})
export class MerchantsModule {}
