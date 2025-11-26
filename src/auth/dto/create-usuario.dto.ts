/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../usuario/role.enum';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(3)
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  senha: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role; // se não vier, Prisma usa default RH
}
