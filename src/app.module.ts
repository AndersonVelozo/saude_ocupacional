import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PacienteModule } from './paciente/paciente.module';
import { AsoModule } from './aso/aso.module';
import { ExameModule } from './exame/exame.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsuarioModule,
    PacienteModule,
    AsoModule,
    ExameModule,
    DashboardModule,
  ],
})
export class AppModule {}
