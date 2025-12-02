// src/colaborador/colaborador.controller.ts
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ColaboradorService } from './colaborador.service';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';

@Controller('colaborador')
export class ColaboradorController {
  constructor(private readonly colaboradorService: ColaboradorService) {}

  @Post()
  create(@Body() dto: CreateColaboradorDto) {
    return this.colaboradorService.create(dto);
  }

  @Get()
  findAll() {
    return this.colaboradorService.findAll();
  }

  @Get('empresa/:empresaId')
  findByEmpresa(@Param('empresaId') empresaId: string) {
    return this.colaboradorService.findByEmpresa(Number(empresaId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colaboradorService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateColaboradorDto) {
    return this.colaboradorService.update(Number(id), dto);
  }

  @Patch(':id/desativar')
  desativar(@Param('id') id: string) {
    return this.colaboradorService.desativar(Number(id));
  }
}
