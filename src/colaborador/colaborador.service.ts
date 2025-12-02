// src/colaborador/colaborador.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';

@Injectable()
export class ColaboradorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateColaboradorDto) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: dto.empresaId },
    });
    if (!empresa) throw new NotFoundException('Empresa não encontrada');

    const cpfJaExiste = await this.prisma.colaborador.findUnique({
      where: { cpf: dto.cpf },
    });
    if (cpfJaExiste)
      throw new BadRequestException('Já existe colaborador com esse CPF');

    return this.prisma.colaborador.create({
      data: {
        nome: dto.nome,
        cpf: dto.cpf,
        dataNascimento: new Date(dto.dataNascimento),
        funcao: dto.funcao,
        setor: dto.setor,
        dataAdmissao: new Date(dto.dataAdmissao),
        empresaId: dto.empresaId,
        ativo: dto.ativo ?? true,
      },
      include: {
        empresa: true,
      },
    });
  }

  async findAll() {
    return this.prisma.colaborador.findMany({
      orderBy: { id: 'asc' },
      include: {
        empresa: true,
      },
    });
  }

  async findByEmpresa(empresaId: number) {
    return this.prisma.colaborador.findMany({
      where: { empresaId },
      orderBy: { id: 'asc' },
      include: {
        empresa: true,
      },
    });
  }

  async findOne(id: number) {
    const colaborador = await this.prisma.colaborador.findUnique({
      where: { id },
      include: {
        empresa: true,
        exames: {
          include: { aso: true },
          orderBy: { data: 'desc' },
        },
      },
    });

    if (!colaborador) throw new NotFoundException('Colaborador não encontrado');

    return colaborador;
  }

  async update(id: number, dto: UpdateColaboradorDto) {
    const colaborador = await this.prisma.colaborador.findUnique({
      where: { id },
    });
    if (!colaborador) throw new NotFoundException('Colaborador não encontrado');

    if (dto.empresaId) {
      const empresa = await this.prisma.empresa.findUnique({
        where: { id: dto.empresaId },
      });
      if (!empresa) throw new NotFoundException('Empresa não encontrada');
    }

    if (dto.cpf && dto.cpf !== colaborador.cpf) {
      const cpfJaExiste = await this.prisma.colaborador.findUnique({
        where: { cpf: dto.cpf },
      });
      if (cpfJaExiste)
        throw new BadRequestException('Já existe colaborador com esse CPF');
    }

    return this.prisma.colaborador.update({
      where: { id },
      data: {
        nome: dto.nome ?? undefined,
        cpf: dto.cpf ?? undefined,
        dataNascimento: dto.dataNascimento
          ? new Date(dto.dataNascimento)
          : undefined,
        funcao: dto.funcao ?? undefined,
        setor: dto.setor ?? undefined,
        dataAdmissao: dto.dataAdmissao ? new Date(dto.dataAdmissao) : undefined,
        empresaId: dto.empresaId ?? undefined,
        ativo: dto.ativo ?? undefined,
      },
      include: {
        empresa: true,
      },
    });
  }

  async desativar(id: number) {
    const colaborador = await this.prisma.colaborador.findUnique({
      where: { id },
    });
    if (!colaborador) throw new NotFoundException('Colaborador não encontrado');

    return this.prisma.colaborador.update({
      where: { id },
      data: { ativo: false },
      include: {
        empresa: true,
      },
    });
  }
}
