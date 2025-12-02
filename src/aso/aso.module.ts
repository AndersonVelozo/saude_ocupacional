import { Module } from '@nestjs/common';
import { AsoService } from './aso.service';
import { AsoController } from './aso.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AsoController],
  providers: [AsoService],
  exports: [AsoService],
})
export class AsoModule {}
