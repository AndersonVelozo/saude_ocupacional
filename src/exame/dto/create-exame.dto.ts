import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { TipoExame } from '@prisma/client';

export class CreateExameOcupacionalDto {
  @IsInt()
  colaboradorId: number;

  @IsEnum(TipoExame)
  tipo: TipoExame;

  @IsDateString()
  data: string;

  @IsOptional()
  @IsString()
  observacao?: string;
}
