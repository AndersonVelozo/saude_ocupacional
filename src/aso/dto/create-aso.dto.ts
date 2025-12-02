import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAsoDto {
  @IsInt()
  exameId: number; // ExameOcupacional

  @IsBoolean()
  apto: boolean;

  @IsOptional()
  @IsString()
  parecer?: string;
}
