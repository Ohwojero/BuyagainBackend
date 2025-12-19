import { Module } from '@nestjs/common';
import { TeammembersController } from './teammembers.controller';
import { TeammembersService } from './teammembers.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TeammembersController],
  providers: [TeammembersService],
})
export class TeammembersModule {}
