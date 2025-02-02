import { Injectable } from '@nestjs/common';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CitizenService {
  constructor(private prisma: PrismaService) {}
  async create(createCitizenDto: CreateCitizenDto) {
    const citizen = await this.prisma.citizen.create({
      data: createCitizenDto,
      select: {
        email: true,
        name: true,
        surname: true,
        role: {
          select: { name: true },
        },
      },
    });
    return { data: citizen, message: 'Citoyen créé avec succès' };
  }

  async findAll() {
    const citizens = await this.prisma.citizen.findMany({
      select: {
        email: true,
        name: true,
        surname: true,
        role: {
          select: { name: true },
        },
      },
    });
    return { data: citizens, message: 'Citoyens récupérés avec succès' };
  }

  async findOne(id: string) {
    const citizen = await this.prisma.citizen.findUnique({
      where: { id: id },
      select: {
        email: true,
        name: true,
        surname: true,
        role: {
          select: { name: true },
        },
      },
    });
    return { data: citizen, message: 'Citoyen récupéré avec succès' };
  }

  async update(id: string, updateCitizenDto: UpdateCitizenDto) {
    const citizen = await this.prisma.citizen.update({
      data: updateCitizenDto,
      where: { id: id },
      select: {
        email: true,
        name: true,
        surname: true,
        role: {
          select: { name: true },
        },
      },
    });
    return { data: citizen, message: 'Citoyen mis à jour avec succès' };
  }

  async remove(id: string) {
    await this.prisma.citizen.delete({ where: { id: id } });
    return 'Citoyen Supprimer avec succès';
  }
}
