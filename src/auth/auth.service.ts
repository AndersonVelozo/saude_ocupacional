// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuarioService.findByEmail(dto.email);

    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const senhaOk = await bcrypt.compare(dto.senha, usuario.senha);
    if (!senhaOk) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const payload = {
      sub: usuario.id,
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      nome: usuario.nome,
      role: usuario.role,
    };
  }
}
