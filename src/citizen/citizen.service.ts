/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

@Injectable()
export class CitizenService {
  constructor(private prisma: PrismaService) {}

  async create(createCitizenDto: CreateCitizenDto) {
    try {
      const citizen = await this.prisma.resource.create({
        data: createCitizenDto,
        select: {
          title: true,
          description: true,
          maxParticipant: true,
          nbParticipant: true,
          deadLine: true,
          isValidate: true,
          status: true,
          file: {
            select: { path: true },
          },
        },
      });

      if (!citizen) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création de la Ressources`,
        );
      }

      return { data: citizen, message: 'Ressources créé avec succès' };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Une erreur de validation est survenue (données dupliquées)',
        );
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async findAll(
    page: number = 1,
    pageSize: number = 50,
    orderBy: string = 'createdAt',
    sortBy: string = 'desc',
  ) {
    try {
      if (page <= 0 || pageSize <= 0) {
        throw new BadRequestException(
          'Les paramètres page et pageSize doivent être supérieurs à 0',
        );
      }

      if (sortBy !== 'asc' && sortBy !== 'desc') {
        throw new BadRequestException(
          'Le paramètre "sort" doit être "asc" ou "desc"',
        );
      }

      if (pageSize > 100) {
        throw new BadRequestException('Nombre de retour maximum dépassé');
      }

      const validOrderByFields = [
        'email',
        'name',
        'surname',
        'createdAt',
        'updatedAt',
      ];

      if (!validOrderByFields.includes(orderBy)) {
        throw new BadRequestException('Le paramètre "orderBy" est invalide.');
      }

      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const citizens = await this.prisma.resource.findMany({
        skip,
        take,
        orderBy: {
          [orderBy]: sortBy,
        },
        select: {
          title: true,
          description: true,
          maxParticipant: true,
          nbParticipant: true,
          deadLine: true,
          isValidate: true,
          status: true,
          file: {
            select: { path: true },
          },
        },
      });

      if (!citizens || citizens.length === 0) {
        throw new NotFoundException('Aucune Ressources trouvé');
      }
      const totalCitizens = await this.prisma.citizen.count();

      return {
        data: citizens,
        total: totalCitizens,
        page,
        pageSize,
        message: 'Ressources récupérés avec succès',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async findOne(id: string) {
    try {
      const citizen = await this.prisma.resource.findUnique({
        where: { id: id },
        select: {
          title: true,
          description: true,
          maxParticipant: true,
          nbParticipant: true,
          deadLine: true,
          isValidate: true,
          status: true,
          file: {
            select: { path: true },
          },
        },
      });

      if (!citizen) {
        throw new NotFoundException('Ressources non trouvé');
      }

      return { data: citizen, message: 'Ressources récupéré avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async update(id: string, updateCitizenDto: UpdateCitizenDto) {
    try {
      const citizen = await this.prisma.resource.update({
        data: updateCitizenDto,
        where: { id: id },
        select: {
          title: true,
          description: true,
          maxParticipant: true,
          nbParticipant: true,
          deadLine: true,
          isValidate: true,
          status: true,
          file: {
            select: { path: true },
          },
        },
      });

      if (!citizen) {
        throw new NotFoundException('Ressources non trouvé pour la mise à jour');
      }

      return { data: citizen, message: 'Ressources mis à jour avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new BadRequestException('Contrainte violée : donnée dupliquée');
      }
      console.error(error);
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
        throw new NotFoundException('Ressources non trouvé');
      }

      await this.prisma.citizen.delete({ where: { id: id } });
      return { message: 'Ressources supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer cette Ressources : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du citoyen',
      );
    }
  }
}
