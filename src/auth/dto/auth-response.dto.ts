import { Role } from '@prisma/client';

export class AuthResponseDto {
  token: string;
  nome: string;
  role: Role;
}
