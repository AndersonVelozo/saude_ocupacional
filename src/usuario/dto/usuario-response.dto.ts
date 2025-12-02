import { Role } from '../role.enum';

export class UsuarioResponseDto {
  id: number;
  nome: string;
  email: string;
  role: Role;
  ativo: boolean;
  criadoEm: Date;
}
