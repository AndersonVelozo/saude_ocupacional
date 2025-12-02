import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { TipoExame } from '@prisma/client';

export class UpdateExameOcupacionalDto {
  @IsOptional()
  @IsInt()
  colaboradorId?: number;

  @IsOptional()
  @IsEnum(TipoExame)
  tipo?: TipoExame;

  @IsOptional()
  @IsDateString()
  data?: string;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsOptional()
  ativo?: boolean;
}
