import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProgressionService } from 'src/progression/progression.service'; // Si nécessaire
import { RessourceService } from 'src/Ressource/Ressource.service';

describe('CommentService', () => {
  let service: CommentService;
  let prisma: PrismaService;

  const mockPrisma = {
    comment: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
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

  describe('CommentService - update', () => {
    it('should update a comment successfully', async () => {
      const id = 'comment-123';
      const updateDto = {
        title: 'Updated Title',
        description: 'Updated Description',
        citizenId: 'fakeId',
      };

      const updatedComment = {
        id: 'comment-123',
        title: 'Updated Title',
        description: 'Updated Description',
        ressourceId: 'ressource-123',
        updatedAt: new Date(),
        citizen: {
          name: 'John',
          surname: 'Doe',
        },
      };

      mockPrisma.comment.update = jest.fn().mockResolvedValue(updatedComment);

      const result = await service.update(id, updateDto);

      expect(result).toEqual({
        data: updatedComment,
        message: 'Commentaire mis à jour avec succès',
      });
    });

    it('should throw NotFoundException if comment not found', async () => {
      const id = 'non-existent-id';
      const updateDto = {
        title: 'Any Title',
        description: 'Any Description',
        citizenId: 'fakeId',
      };

      mockPrisma.comment.update = jest.fn().mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException on duplicate error (P2002)', async () => {
      const id = 'comment-123';
      const updateDto = {
        title: 'Duplicate Title',
        description: 'Duplicate Description',
        citizenId: 'fakeId',
      };

      mockPrisma.comment.update = jest
        .fn()
        .mockRejectedValue({ code: 'P2002' });

      await expect(service.update(id, updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      const id = 'comment-123';
      const updateDto = {
        title: 'Title',
        description: 'Description',
        citizenId: 'fakeId',
      };

      mockPrisma.comment.update = jest
        .fn()
        .mockRejectedValue(new Error('Unexpected'));

      await expect(service.update(id, updateDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('CommentService - remove', () => {
    it('should delete a comment successfully', async () => {
      const id = 'comment-123';

      mockPrisma.comment.findUnique = jest.fn().mockResolvedValue({ id });
      mockPrisma.comment.delete = jest.fn().mockResolvedValue({ id });

      const result = await service.remove(id);

      expect(mockPrisma.comment.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockPrisma.comment.delete).toHaveBeenCalledWith({ where: { id } });

      expect(result).toEqual({
        message: 'Commentaire supprimé avec succès',
      });
    });

    it('should throw NotFoundException if comment not found', async () => {
      const id = 'non-existent-id';

      mockPrisma.comment.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if deletion violates a constraint (P2003)', async () => {
      const id = 'comment-123';

      mockPrisma.comment.findUnique = jest.fn().mockResolvedValue({ id });
      mockPrisma.comment.delete = jest
        .fn()
        .mockRejectedValue({ code: 'P2003' });

      await expect(service.remove(id)).rejects.toThrow(ForbiddenException);
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      const id = 'comment-123';

      mockPrisma.comment.findUnique = jest.fn().mockResolvedValue({ id });
      mockPrisma.comment.delete = jest
        .fn()
        .mockRejectedValue(new Error('Unknown error'));

      await expect(service.remove(id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('CommentService - findOne', () => {
    it('should return one comment by id', async () => {
      const id = 'comment-123';
      const fakeComment = {
        id,
        title: 'Test Comment',
        description: 'Test Description',
        ressourceId: 'res-123',
        updatedAt: new Date(),
        citizen: {
          id: 'citizen-1',
          name: 'John',
          surname: 'Doe',
        },
      };

      mockPrisma.comment.findUnique = jest.fn().mockResolvedValue(fakeComment);

      const result = await service.findOne(id);

      expect(result).toEqual({
        data: fakeComment,
        message: 'Commentaire récupéré avec succès',
      });
    });

    it('should throw NotFoundException if comment not found', async () => {
      mockPrisma.comment.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockPrisma.comment.findUnique = jest
        .fn()
        .mockRejectedValue(new Error('Unknown error'));

      await expect(service.findOne('some-id')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
