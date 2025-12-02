/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔹 Resumo geral para cards + gráficos
  async getResumoGeral() {
    const [
      totalEmpresas,
      totalColaboradores,
      totalExamesOcupacionais,
      totalAsos,
      examesPorTipoRaw,
      asosPorAptidaoRaw,
    ] = await Promise.all([
      this.prisma.empresa.count(),
      this.prisma.colaborador.count(),
      this.prisma.exameOcupacional.count(),
      this.prisma.aso.count(),
      this.prisma.exameOcupacional.groupBy({
        by: ['tipo'],
        _count: { _all: true },
      }),
      this.prisma.aso.groupBy({
        by: ['apto'],
        _count: { _all: true },
      }),
    ]);

    const examesPorTipo = examesPorTipoRaw.map((e) => ({
      tipo: e.tipo,
      quantidade: e._count._all,
    }));

    const asosPorAptidao = {
      apto: asosPorAptidaoRaw.find((a) => a.apto === true)?._count._all ?? 0,
      inapto: asosPorAptidaoRaw.find((a) => a.apto === false)?._count._all ?? 0,
    };

    return {
      cards: {
        totalEmpresas,
        totalColaboradores,
        totalExamesOcupacionais,
        totalAsos,
      },
      examesPorTipo,
      asosPorAptidao,
    };
  }

  // 🔹 Resumo por empresa (para filtros de dashboard)
  async getResumoEmpresa(empresaId: number) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    const [totalColaboradores, totalExamesOcupacionais, totalAsos] =
      await Promise.all([
        this.prisma.colaborador.count({ where: { empresaId } }),
        this.prisma.exameOcupacional.count({
          where: { colaborador: { empresaId } },
        }),
        this.prisma.aso.count({
          where: { exame: { colaborador: { empresaId } } },
        }),
      ]);

    return {
      empresa,
      cards: {
        totalColaboradores,
        totalExamesOcupacionais,
        totalAsos,
      },
    };
  }
}
