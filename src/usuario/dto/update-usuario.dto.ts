export class UpdateUsuarioDto {
  nome?: string;
  email?: string;
  role?: 'ADMIN' | 'RH' | 'CLINICA';
  ativo?: boolean;
}
