/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, MinLength } from 'class-validator';

export class AlterarSenhaDto {
  @IsString()
  @MinLength(4)
  senhaAtual: string;

  @IsString()
  @MinLength(4)
  novaSenha: string;
}
