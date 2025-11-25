import { Module, OnModuleInit } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [UsuarioService, PrismaService],
  exports: [UsuarioService],
})
export class UsuarioModule implements OnModuleInit {
  constructor(private usuarioService: UsuarioService) {}

  async onModuleInit() {
    await this.usuarioService.criarAdminSeNaoExistir();
  }
}
