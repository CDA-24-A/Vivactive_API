import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  async create(createCommentDto: CreateCommentDto) {
    try {    
    
          const comment = await this.prisma.comment.create({
            data: createCommentDto,
            select: {
              title: true,
              description: true,
              createdAt: true,
              citizen: {
                select: {
                  name: true,
                  surname: true,
                },
              }
            },
          });
    
          if (!comment) {
            throw new InternalServerErrorException(
              `Une erreur est survenue lors de la création du commentaire`,
            );
          }
    
          return { data: comment, message: 'Commentaire créé avec succès' };
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

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {

          console.log(updateCommentDto, id);
          
    
          const comment = await this.prisma.comment.update({
            data: updateCommentDto,
            where: { id: id },
            select: {
              title: true,
              description: true,
              createdAt: true,
              citizen: {
                select: {
                  name: true,
                  surname: true,
                },
              }
            },
          });
    
          if (!comment) {
            throw new NotFoundException('Commentaire non trouvé pour la mise à jour');
          }
    
          return { data: comment, message: 'Commentaire mis à jour avec succès' };
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
          const comment = await this.prisma.comment.findUnique({
            where: { id: id },
          });
          if (!comment) {
            throw new NotFoundException('Commentaire non trouvé');
          }
    
          await this.prisma.comment.delete({ where: { id: id } });
          return { message: 'Commentaire supprimé avec succès' };
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw error;
          }
          if (error.code === 'P2003') {
            throw new ForbiddenException(
              'Impossible de supprimer ce commentaire : contrainte de dépendance',
            );
          }
          throw new InternalServerErrorException(
            'Une erreur inconnue est survenue lors de la suppression du commentaire',
          );
        }
  }
}
