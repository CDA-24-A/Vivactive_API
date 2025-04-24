import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProgressionService } from 'src/progression/progression.service'; // Si nécessaire
import { RessourceService } from 'src/Ressource/Ressource.service';

describe('CommentService', () => {
  let service: CommentService;
  let prisma: PrismaService;

  const mockPrisma = {
    comment: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RessourceService, useValue: {} }, // Si tu as besoin de mocker des services comme RessourceService
        { provide: ProgressionService, useValue: {} }, // Pareil pour ProgressionService
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a comment successfully', async () => {
    const dto = {
      title: 'Test Comment',
      description: 'Test Comment Description',
      ressourceId: 'ressource-123',
      citizenId: 'citizen-123',
    };

    const fakeComment = {
      id: 'comment-123',
      title: 'Test Comment',
      description: 'Test Comment Description',
      updatedAt: new Date(),
      ressourceId: 'ressource-123',
      citizen: { name: 'John', surname: 'Doe' },
    };

    mockPrisma.comment.create.mockResolvedValue(fakeComment);

    const result = await service.create(dto);

    expect(result).toEqual({
      data: fakeComment,
      message: 'Commentaire créé avec succès',
    });
  });

  it('should throw BadRequestException on duplicate error (P2002)', async () => {
    const dto = {
      title: 'Duplicate Comment',
      description: 'Duplicate Comment Description',
      ressourceId: 'ressource-123',
      citizenId: 'citizen-123',
    };

    mockPrisma.comment.create.mockRejectedValue({ code: 'P2002' });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw InternalServerErrorException if an unknown error occurs', async () => {
    const dto = {
      title: 'Test Comment',
      description: 'Test Comment Description',
      ressourceId: 'ressource-123',
      citizenId: 'citizen-123',
    };

    mockPrisma.comment.create.mockRejectedValue(new Error('Unknown error'));

    await expect(service.create(dto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
