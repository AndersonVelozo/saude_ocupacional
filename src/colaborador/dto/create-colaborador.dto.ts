// src/colaborador/dto/create-colaborador.dto.ts
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateColaboradorDto {
  @IsString()
  nome: string;

  @IsString()
  cpf: string;

  @IsDateString()
  dataNascimento: string;

  @IsString()
  funcao: string;

  @IsOptional()
  @IsString()
  setor?: string;

  @IsDateString()
  dataAdmissao: string;

  @IsInt()
  empresaId: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
