/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExameService } from './exame.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../usuario/role.enum';
import { CreateExameOcupacionalDto } from './dto/create-exame.dto';
import { UpdateExameOcupacionalDto } from './dto/update-exame.dto';
import { RolesGuard } from '../auth/roles.guard'; // 👈 importa

@Controller('exame-ocupacional')
@UseGuards(JwtAuthGuard, RolesGuard) // 👈 os dois aqui
export class ExameController {
  constructor(private readonly exameService: ExameService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RH, Role.MEDICO)
  criar(@Body() dto: CreateExameOcupacionalDto) {
    return this.exameService.criar(dto);
  }

  @Get('colaborador/:id')
  @Roles(Role.ADMIN, Role.RH, Role.MEDICO)
  listarPorColaborador(@Param('id') id: string) {
    return this.exameService.listarPorColaborador(Number(id));
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RH, Role.MEDICO)
  detalhes(@Param('id') id: string) {
    return this.exameService.detalhes(Number(id));
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RH)
  atualizar(@Param('id') id: string, @Body() dto: UpdateExameOcupacionalDto) {
    return this.exameService.atualizar(Number(id), dto);
  }
}
