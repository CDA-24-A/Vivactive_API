import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService) {}
async create(createInviteDto: CreateInviteDto) {
    try {
      const invite = await this.prisma.invite.create({
        data: createInviteDto,
        select: {
          accept: true,
          createdAt: true,
          sender: {
            select: {
              name: true,
              surname: true,
            },
          },
          recever: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!invite) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création du invite`,
        );
      }

      return { data: invite, message: 'invite créé avec succès' };
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

  async findOne(id: string) {
    try {
      const invite = await this.prisma.invite.findUnique({
        where: { id: id },
        select: {
          accept: true,
          createdAt: true,
          sender: {
            select: {
              name: true,
              surname: true,
            },
          },
          recever: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!invite) {
        throw new NotFoundException('Invite non trouvé');
      }

      return { data: invite, message: 'Invite récupéré avec succès' };
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

  async remove(id: string) {
    try {
      const Invite = await this.prisma.invite.findUnique({
        where: { id: id },
      });
      if (!Invite) {
        throw new NotFoundException('Invite non trouvé');
      }

      await this.prisma.invite.delete({ where: { id: id } });
      return { Invite: 'Invite supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer ce Invite : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du Invite',
      );
    }
  }
}
