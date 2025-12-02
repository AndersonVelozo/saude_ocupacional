/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacienteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePacienteDto) {
    const cpfJaExiste = await this.prisma.paciente.findUnique({
      where: { cpf: dto.cpf },
    });

    if (cpfJaExiste) {
      throw new BadRequestException('Já existe paciente com esse CPF');
    }

    return this.prisma.paciente.create({
      data: {
        nome: dto.nome,
        cpf: dto.cpf,
        dataNascimento: dto.dataNascimento
          ? new Date(dto.dataNascimento)
          : undefined,
        cargo: dto.cargo,
        setor: dto.setor,
        empresa: dto.empresa,
        ativo: dto.ativo ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.paciente.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
      include: {
        exames: {
          orderBy: { data: 'desc' },
        },
      },
    });

    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return paciente;
  }

  async update(id: number, dto: UpdatePacienteDto) {
    const existente = await this.prisma.paciente.findUnique({ where: { id } });
    if (!existente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    if (dto.cpf && dto.cpf !== existente.cpf) {
      const cpfJaExiste = await this.prisma.paciente.findUnique({
        where: { cpf: dto.cpf },
      });
      if (cpfJaExiste) {
        throw new BadRequestException('Já existe paciente com esse CPF');
      }
    }

    return this.prisma.paciente.update({
      where: { id },
      data: {
        nome: dto.nome ?? undefined,
        cpf: dto.cpf ?? undefined,
        dataNascimento: dto.dataNascimento
          ? new Date(dto.dataNascimento)
          : undefined,
        cargo: dto.cargo ?? undefined,
        setor: dto.setor ?? undefined,
        empresa: dto.empresa ?? undefined,
        ativo: dto.ativo ?? undefined,
      },
    });
  }

  async desativar(id: number) {
    const paciente = await this.prisma.paciente.findUnique({ where: { id } });
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return this.prisma.paciente.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
