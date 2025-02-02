import { Injectable } from '@nestjs/common';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CitizenService {
  constructor(private prisma: PrismaService) {}
  create(createCitizenDto: CreateCitizenDto) {
    return this.prisma.citizen.create({ data: createCitizenDto });
  }

  async findAll() {
    return await this.prisma.citizen.findMany({
      select: {
        email: true,
        name: true,
        surname: true,
        role: {
          select: { name: true },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.citizen.findUnique({
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
  }

  async update(id: string, updateCitizenDto: UpdateCitizenDto) {
    await this.prisma.citizen.update({
      data: updateCitizenDto,
      where: { id: id },
    });
    return 'Votre profil a bien été mis à jour';
  }

  async remove(id: string) {
    await this.prisma.citizen.delete({ where: { id: id } });
    return 'Citoyen Supprimer avec succès';
  }
}
