import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { CommentType } from 'src/utils/types/PrismaApiModel.type';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) : Promise<ApiReturns<CommentType | null>> {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll(citizenId: string | null) {
    try {
          if (citizenId !== ) {
            throw new BadRequestException(
              'Cet utilisateur n\'existe pas',
            );
          }
    
          const citizens = await this.prisma.comment.findMany({
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
          const totalCitizens = await this.prisma.citizen.count();
    
          return {
            data: citizens,
            total: totalCitizens,
            page,
            pageSize,
            message: 'Citoyens récupérés avec succès',
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
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
