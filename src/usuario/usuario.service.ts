/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Role } from '@prisma/client';

export interface AlterarSenhaDto {
  senhaAtual: string;
  novaSenha: string;
}

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly publicSelect = {
    id: true,
    nome: true,
    email: true,
    role: true,
    ativo: true,
    criadoEm: true,
  };

  // 📌 Criar usuário
  async create(dto: CreateUsuarioDto) {
    const emailJaExiste = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (emailJaExiste) {
      throw new BadRequestException('E-mail já está em uso');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    return this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: senhaHash,
        role: dto.role ?? Role.RH, // usa enum do Prisma
        ativo: dto.ativo ?? true,
      },
      select: this.publicSelect,
    });
  }

  // 📌 Listar usuários
  async findAll() {
    return this.prisma.usuario.findMany({
      orderBy: { id: 'asc' },
      select: this.publicSelect,
    });
  }

  // 📌 Buscar 1 usuário
  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: this.publicSelect,
    });

    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    return usuario;
  }

  // 📌 Editar usuário
  async update(id: number, dto: UpdateUsuarioDto) {
    const existe = await this.prisma.usuario.findUnique({ where: { id } });
    if (!existe) throw new NotFoundException('Usuário não encontrado');

    if (dto.email && dto.email !== existe.email) {
      const emailJaExiste = await this.prisma.usuario.findUnique({
        where: { email: dto.email },
      });
      if (emailJaExiste) {
        throw new BadRequestException('E-mail já está em uso');
      }
    }

    return this.prisma.usuario.update({
      where: { id },
      data: {
        nome: dto.nome ?? undefined,
        email: dto.email ?? undefined,
        role: dto.role ?? undefined,
        ativo: dto.ativo ?? undefined,
      },
      select: this.publicSelect,
    });
  }

  // 📌 Desativar usuário
  async desativar(id: number) {
    const existe = await this.prisma.usuario.findUnique({ where: { id } });
    if (!existe) throw new NotFoundException('Usuário não encontrado');

    return this.prisma.usuario.update({
      where: { id },
      data: { ativo: false },
      select: this.publicSelect,
    });
  }

  // 📌 Usuário altera a própria senha
  async alterarSenha(id: number, dto: AlterarSenhaDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const senhaConfere = await bcrypt.compare(dto.senhaAtual, usuario.senha);
    if (!senhaConfere) {
      throw new BadRequestException('Senha atual incorreta');
    }

    const novaHash = await bcrypt.hash(dto.novaSenha, 10);

    await this.prisma.usuario.update({
      where: { id },
      data: { senha: novaHash },
    });

    return { message: 'Senha alterada com sucesso' };
  }

  // 📌 Admin redefine senha sem senha atual
  async alterarSenhaAdmin(id: number, dto: ChangePasswordDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const novaHash = await bcrypt.hash(dto.novaSenha, 10);

    await this.prisma.usuario.update({
      where: { id },
      data: { senha: novaHash },
    });

    return { message: 'Senha alterada com sucesso' };
  }

  // 📌 Usado pelo AuthService e JwtStrategy
  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }
}
