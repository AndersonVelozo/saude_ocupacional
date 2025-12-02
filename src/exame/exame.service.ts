/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsupported-features */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExameOcupacionalDto } from './dto/create-exame.dto';
import { UpdateExameOcupacionalDto } from './dto/update-exame.dto';

@Injectable()
export class ExameService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateExameOcupacionalDto) {
    const colaborador = await this.prisma.colaborador.findUnique({
      where: { id: dto.colaboradorId },
    });
    if (!colaborador) {
      throw new NotFoundException('Colaborador não encontrado');
    }

    return this.prisma.exameOcupacional.create({
      data: {
        colaboradorId: dto.colaboradorId,
        tipo: dto.tipo,
        data: new Date(dto.data),
        observacao: dto.observacao,
      },
      include: {
        colaborador: true,
        aso: true,
      },
    });
  }

  async listarPorColaborador(colaboradorId: number) {
    return this.prisma.exameOcupacional.findMany({
      where: { colaboradorId },
      orderBy: { data: 'desc' },
      include: {
        aso: true,
      },
    });
  }

  async detalhes(id: number) {
    const exame = await this.prisma.exameOcupacional.findUnique({
      where: { id },
      include: {
        colaborador: true,
        aso: true,
      },
    });

    if (!exame) {
      throw new NotFoundException('Exame ocupacional não encontrado');
    }

    return exame;
  }

  async atualizar(id: number, dto: UpdateExameOcupacionalDto) {
    const exame = await this.prisma.exameOcupacional.findUnique({
      where: { id },
    });
    if (!exame) throw new NotFoundException('Exame ocupacional não encontrado');

    return this.prisma.exameOcupacional.update({
      where: { id },
      data: {
        colaboradorId: dto.colaboradorId ?? undefined,
        tipo: dto.tipo ?? undefined,
        data: dto.data ? new Date(dto.data) : undefined,
        observacao: dto.observacao ?? undefined,
        ativo: dto.ativo ?? undefined,
      },
    });
  }
}
