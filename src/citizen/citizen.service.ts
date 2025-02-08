import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CitizenService {
  constructor(private prisma: PrismaService) {}
  private readonly saltRounds = 10;

  private async hashingPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async create(createCitizenDto: CreateCitizenDto) {
    try {
      const hashedPassword = await this.hashingPassword(
        createCitizenDto.password,
      );

      const citizenData = { ...createCitizenDto, password: hashedPassword };

      const citizen = await this.prisma.citizen.create({
        data: citizenData,
        select: {
          email: true,
          name: true,
          surname: true,
          role: {
            select: { name: true },
          },
        },
      });

      if (!citizen) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création du citoyen`,
        );
      }

      return { data: citizen, message: 'Citoyen créé avec succès' };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Une erreur de validation est survenue (données dupliquées)',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async findAll() {
    try {
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

      if (!citizens || citizens.length === 0) {
        throw new NotFoundException('Aucun citoyen trouvé');
      }

      return { data: citizens, message: 'Citoyens récupérés avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async findOne(id: string) {
    try {
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

      if (!citizen) {
        throw new NotFoundException('Citoyen non trouvé');
      }

      return { data: citizen, message: 'Citoyen récupéré avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async update(id: string, updateCitizenDto: UpdateCitizenDto) {
    try {
      const hashedPassword = await this.hashingPassword(
        updateCitizenDto.password,
      );

      const citizenData = { ...updateCitizenDto, password: hashedPassword };

      const citizen = await this.prisma.citizen.update({
        data: citizenData,
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

      if (!citizen) {
        throw new NotFoundException('Citoyen non trouvé pour la mise à jour');
      }

      return { data: citizen, message: 'Citoyen mis à jour avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new BadRequestException('Contrainte violée : donnée dupliquée');
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async remove(id: string) {
    try {
      const citizen = await this.prisma.citizen.findUnique({
        where: { id: id },
      });
      if (!citizen) {
        throw new NotFoundException('Citoyen non trouvé');
      }

      await this.prisma.citizen.delete({ where: { id: id } });
      return { message: 'Citoyen supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer ce citoyen : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du citoyen',
      );
    }
  }
}
