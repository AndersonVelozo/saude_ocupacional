import { Module } from '@nestjs/common';
import { ExameService } from './exame.service';
import { ExameController } from './exame.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExameController],
  providers: [ExameService],
  exports: [ExameService],
})
export class ExameModule {}
