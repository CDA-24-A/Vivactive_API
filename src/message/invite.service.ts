import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService) {}
  async create(createInviteDto: CreateInviteDto) {
    try {    
    
      const invite = await this.prisma.invite.update({
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
      
    
          if (!invites) {
            throw new InternalServerErrorException(
              `Une erreur est survenue lors de la création du Invite`,
            );
          }
    
          return { data: invites, Invite: 'Invite créé avec succès' };
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

  async findAll(citizenId: string | undefined) {
    try {
      const invites = await this.prisma.invite.findMany({
        where: {
          OR: [{ senderId: citizenId }, { receverId: citizenId }],
        },
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
      

      if (!invites || invites.length === 0) {
        throw new NotFoundException('Aucun Invite trouvé');
      }
      const totalInvites = await this.prisma.invite.count();

      return {
        data: invites,
        total: totalInvites,
        Invite: 'Invites récupérés avec succès',
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
      const invite = await this.prisma.invite.update({
        data: UpdateInviteDto,
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

      return { data: invite, Invite: 'Invite récupéré avec succès' };
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

  async update(id: string, updateInviteDto: UpdateInviteDto) {
    try {

      const invite = await this.prisma.invite.update({
        data: updateInviteDto,
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
            throw new NotFoundException('Invite non trouvé pour la mise à jour');
          }
    
          return { data: invite, Invite: 'Invite mis à jour avec succès' };
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
