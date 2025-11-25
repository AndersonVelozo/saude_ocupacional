export class CreateUsuarioDto {
  nome: string;
  email: string;
  senha: string;
  role?: 'ADMIN' | 'RH' | 'CLINICA';
  ativo?: boolean;
}
