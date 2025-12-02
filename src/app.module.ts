/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PacienteModule } from './paciente/paciente.module';
import { AsoModule } from './aso/aso.module';
import { ExameModule } from './exame/exame.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EmpresaModule } from './empresa/empresa.module'; // 👈 ADD
import { ColaboradorModule } from './colaborador/colaborador.module'; // 👈 ADD se já criou

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
    EmpresaModule, // 👈 ADD AQUI
    ColaboradorModule, // 👈 ADD AQUI (se existir)
  ],
  providers: [], // 👈 sem APP_GUARD aqui
})
export class AppModule {}
