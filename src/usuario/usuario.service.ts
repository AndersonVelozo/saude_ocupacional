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
import { AlterarSenhaDto } from './dto/alterar-senha.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  // 👉 ADICIONE ESTE MÉTODO:
  async buscarPorEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  // Campos públicos (sem senha)
  private readonly publicSelect = {
    id: true,
    nome: true,
    email: true,
    role: true,
    ativo: true,
    criadoEm: true,
  };

  async create(dto: CreateUsuarioDto) {
    const emailJaExiste = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (emailJaExiste) {
      throw new BadRequestException('E-mail já está em uso');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: senhaHash,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        role: dto.role ?? 'RH',
        ativo: dto.ativo ?? true,
      },
      select: this.publicSelect,
    });

    return usuario;
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      orderBy: { id: 'asc' },
      select: this.publicSelect,
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: this.publicSelect,
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const existe = await this.prisma.usuario.findUnique({ where: { id } });

    if (!existe) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (dto.email && dto.email !== existe.email) {
      const emailJaExiste = await this.prisma.usuario.findUnique({
        where: { email: dto.email },
      });
      if (emailJaExiste) {
        throw new BadRequestException('E-mail já está em uso');
      }
    }

    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: {
        nome: dto.nome ?? undefined,
        email: dto.email ?? undefined,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        role: dto.role ?? undefined,
        ativo: dto.ativo ?? undefined,
      },
      select: this.publicSelect,
    });

    return usuario;
  }

  async desativar(id: number) {
    const existe = await this.prisma.usuario.findUnique({ where: { id } });

    if (!existe) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: { ativo: false },
      select: this.publicSelect,
    });

    return usuario;
  }

  async alterarSenha(id: number, dto: AlterarSenhaDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

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

  // Usado pelo AuthService
  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async alterarSenhaAdmin(id: number, dto: ChangePasswordDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const novaHash = await bcrypt.hash(dto.novaSenha, 10);

    await this.prisma.usuario.update({
      where: { id },
      data: { senha: novaHash },
    });

    return { message: 'Senha alterada com sucesso' };
  }
}
