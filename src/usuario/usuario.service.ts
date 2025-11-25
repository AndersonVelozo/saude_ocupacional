import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role, Usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

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
      },
    });

    console.log('Admin padrão criado: admin@teste.com / 123456');
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async criarUsuario(data: Prisma.UsuarioCreateInput): Promise<Usuario> {
    const senhaHash = await bcrypt.hash(data.senha, 10);
    return this.prisma.usuario.create({
      data: {
        ...data,
        senha: senhaHash,
      },
    });
  }
}
