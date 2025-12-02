/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAsoDto } from './dto/create-aso.dto';

@Injectable()
export class AsoService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateAsoDto, medicoId: number) {
    const exame = await this.prisma.exameOcupacional.findUnique({
      where: { id: dto.exameId },
      include: { colaborador: true, aso: true },
    });

    if (!exame) throw new NotFoundException('Exame ocupacional não encontrado');
    if (exame.aso)
      throw new BadRequestException('Já existe ASO para este exame');

    return this.prisma.aso.create({
      data: {
        exameId: dto.exameId,
        apto: dto.apto,
        parecer: dto.parecer,
        medicoId,
      },
      include: {
        exame: { include: { colaborador: true } },
        medico: true,
      },
    });
  }

  async detalhes(id: number) {
    const aso = await this.prisma.aso.findUnique({
      where: { id },
      include: {
        exame: { include: { colaborador: true } },
        medico: true,
      },
    });

    if (!aso) throw new NotFoundException('ASO não encontrado');
    return aso;
  }

  async historicoPorColaborador(colaboradorId: number) {
    return this.prisma.aso.findMany({
      where: {
        exame: { colaboradorId },
      },
      include: {
        exame: { include: { colaborador: true } },
        medico: true,
      },
      orderBy: { criadoEm: 'desc' },
    });
  }
}
