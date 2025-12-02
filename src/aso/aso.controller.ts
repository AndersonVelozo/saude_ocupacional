/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AsoService } from './aso.service';
import { CreateAsoDto } from './dto/create-aso.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../usuario/role.enum';

@Controller('aso')
@UseGuards(JwtAuthGuard)
export class AsoController {
  constructor(private readonly asoService: AsoService) {}

  // Criar ASO → apenas médico
  @Post()
  @Roles(Role.MEDICO)
  criar(@Body() dto: CreateAsoDto, @Req() req: any) {
    return this.asoService.criar(dto, req.user.id);
  }

  // Detalhes de 1 ASO
  @Get(':id')
  @Roles(Role.ADMIN, Role.RH, Role.MEDICO)
  detalhes(@Param('id') id: string) {
    return this.asoService.detalhes(Number(id));
  }

  // Histórico de ASOs de 1 colaborador
  @Get('colaborador/:id')
  @Roles(Role.ADMIN, Role.RH, Role.MEDICO)
  historico(@Param('id') id: string) {
    return this.asoService.historicoPorColaborador(Number(id));
  }
}
