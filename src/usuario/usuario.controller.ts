/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/usuario/usuario.controller.ts
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AlterarSenhaDto } from './dto/alterar-senha.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from './role.enum';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // ADMIN cria usuário
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.create(dto);
  }

  // ADMIN e RH listam usuários
  @Get()
  @Roles(Role.ADMIN, Role.RH)
  findAll() {
    return this.usuarioService.findAll();
  }

  // ADMIN e RH veem 1 usuário
  @Get(':id')
  @Roles(Role.ADMIN, Role.RH)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.findOne(id);
  }

  // ADMIN edita usuário
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, dto);
  }

  // ADMIN desativa usuário
  @Patch(':id/desativar')
  @Roles(Role.ADMIN)
  desativar(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.desativar(id);
  }

  // Usuário logado altera a própria senha
  @Patch('me/senha')
  alterarMinhaSenha(@Req() req: any, @Body() dto: AlterarSenhaDto) {
    const userId = Number(req.user?.id);
    return this.usuarioService.alterarSenha(userId, dto);
  }

  // ADMIN altera senha de qualquer usuário (sem precisar da senha atual)
  @Patch(':id/senha')
  @Roles(Role.ADMIN)
  alterarSenhaAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usuarioService.alterarSenhaAdmin(id, dto);
  }
}
