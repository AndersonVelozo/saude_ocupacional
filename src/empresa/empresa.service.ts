import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEmpresaDto) {
    const existe = await this.prisma.empresa.findUnique({
      where: { cnpj: dto.cnpj },
    });

    if (existe)
      throw new BadRequestException('Já existe uma empresa com esse CNPJ');

    return this.prisma.empresa.create({
      data: {
        razaoSocial: dto.razaoSocial,
        nomeFantasia: dto.nomeFantasia,
        cnpj: dto.cnpj,
        cnae: dto.cnae,
        grauRisco: dto.grauRisco,
      },
    });
  }

  async findAll() {
    return this.prisma.empresa.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
      include: {
        colaboradores: true,
      },
    });

    if (!empresa) throw new NotFoundException('Empresa não encontrada');
    return empresa;
  }

  async update(id: number, dto: UpdateEmpresaDto) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id } });
    if (!empresa) throw new NotFoundException('Empresa não encontrada');

    return this.prisma.empresa.update({
      where: { id },
      data: {
        razaoSocial: dto.razaoSocial ?? undefined,
        nomeFantasia: dto.nomeFantasia ?? undefined,
        cnae: dto.cnae ?? undefined,
        grauRisco: dto.grauRisco ?? undefined,
        ativo: dto.ativo ?? undefined,
      },
    });
  }

  async desativar(id: number) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id } });
    if (!empresa) throw new NotFoundException('Empresa não encontrada');

    return this.prisma.empresa.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
