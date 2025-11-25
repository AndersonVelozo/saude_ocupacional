import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  // ========= usado no boot do sistema p/ criar admin =========
  async criarAdminSeNaoExistir() {
    const email = 'admin@teste.com';

    const existe = await this.prisma.usuario.findUnique({ where: { email } });
    if (existe) return;

    const senhaHash = await bcrypt.hash('123456', 10);

    await this.prisma.usuario.create({
      data: {
        nome: 'Admin Master',
        email,
        senha: senhaHash,
        role: Role.ADMIN,
        ativo: true,
      },
    });

    console.log('Admin padrão criado: admin@teste.com / 123456');
  }

  // ========= usado pelo AuthService =========
  async buscarPorEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  // ========= CRUD exposto no controller =========

  async create(dto: CreateUsuarioDto) {
    const existe = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (existe) {
      throw new BadRequestException('Email já cadastrado');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    return this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: senhaHash,
        role: (dto.role as Role) ?? Role.RH,
        ativo: dto.ativo ?? true,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        criadoEm: true,
      },
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        criadoEm: true,
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        criadoEm: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (dto.email && dto.email !== usuario.email) {
      const emailJaUsado = await this.prisma.usuario.findUnique({
        where: { email: dto.email },
      });
      if (emailJaUsado) {
        throw new BadRequestException('Email já está em uso');
      }
    }

    return this.prisma.usuario.update({
      where: { id },
      data: {
        nome: dto.nome ?? undefined,
        email: dto.email ?? undefined,
        role: (dto.role as Role) ?? undefined,
        ativo: dto.ativo ?? undefined,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        criadoEm: true,
      },
    });
  }

  async desativar(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.usuario.update({
      where: { id },
      data: { ativo: false },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        ativo: true,
        criadoEm: true,
      },
    });
  }

  async alterarSenha(id: number, dto: ChangePasswordDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const confere = await bcrypt.compare(dto.senhaAtual, usuario.senha);
    if (!confere) {
      throw new BadRequestException('Senha atual incorreta');
    }

    const novaHash = await bcrypt.hash(dto.novaSenha, 10);

    await this.prisma.usuario.update({
      where: { id },
      data: { senha: novaHash },
    });

    return { message: 'Senha alterada com sucesso' };
  }
}
