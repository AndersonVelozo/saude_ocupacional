import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdatePacienteDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsDateString()
  dataNascimento?: string;

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsString()
  setor?: string;

  @IsOptional()
  @IsString()
  empresa?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
