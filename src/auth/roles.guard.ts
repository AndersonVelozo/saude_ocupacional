/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/auth/roles.guard.ts
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '../usuario/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    const user = request.user as { id?: number; role?: Role } | undefined;

    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    if (!user.role) {
      throw new ForbiddenException('Usuário sem perfil definido');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException('Usuário não tem permissão para esta ação');
    }

    return true;
  }
}
