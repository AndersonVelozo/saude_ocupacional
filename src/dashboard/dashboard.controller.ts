/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../usuario/role.enum';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // GET /dashboard/resumo-geral
  @Get('resumo-geral')
  @Roles(Role.ADMIN, Role.RH, Role.MEDICO)
  getResumoGeral() {
    return this.dashboardService.getResumoGeral();
  }

  // GET /dashboard/empresa/1
  @Get('empresa/:id')
  @Roles(Role.ADMIN, Role.RH)
  getResumoEmpresa(@Param('id') id: string) {
    return this.dashboardService.getResumoEmpresa(Number(id));
  }
}
