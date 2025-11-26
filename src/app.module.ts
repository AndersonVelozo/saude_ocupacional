import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PacienteModule } from './paciente/paciente.module';
import { AsoModule } from './aso/aso.module';
import { ExameModule } from './exame/exame.module';
import { DashboardModule } from './dashboard/dashboard.module';

// IMPORTANTE:
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';

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

  // REGISTRA O GUARD GLOBALMENTE
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
