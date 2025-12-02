import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  razaoSocial: string;

  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @IsString()
  cnpj: string;

  @IsOptional()
  @IsString()
  cnae?: string;

  @IsOptional()
  @IsString()
  grauRisco?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
