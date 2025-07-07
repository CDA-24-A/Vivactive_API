/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { StepService } from 'src/step/step.service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RessourceService } from './Ressource.service';

describe('RessourceService - Test', () => {
  let service: RessourceService;
  let prisma: PrismaService;

  const mockStepService = {
    createMany: jest.fn(),
  };

  const mockPrisma = {
    file: {
      create: jest.fn(),
    },
    image: {
      create: jest.fn(),
    },
    ressource: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    step: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RessourceService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: StepService, useValue: mockStepService },
      ],
    }).compile();

    service = module.get<RessourceService>(RessourceService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  describe('RessourceService - create', () => {
    it('should create a ressource with file, banner and steps', async () => {
      const dto = {
        title: 'Test',
        description: 'Test ressource',
        citizenId: 'citizen-1',
        fileBytes: Buffer.from('somefile').toString('base64'),
        bannerBytes: Buffer.from('someimage').toString('base64'),
        step: [
          { title: 'Étape 1', description: 'Desc 1', order: 1 },
          { title: 'Étape 2', description: 'Desc 2', order: 2 },
        ],
      };

      const mockFile = { id: 'file-123' };
      const mockBanner = { id: 'image-456' };
      const mockRessource = { id: 'ressource-789' };
      const mockFinalRessource = {
        id: 'ressource-789',
        title: 'Test',
        description: 'Test ressource',
        maxParticipant: 10,
        nbParticipant: 0,
        deadLine: new Date(),
        isValidate: false,
        status: 'EN_ATTENTE',
        file: { path: Buffer.from('somefile'), id: 'file-123' },
        banner: { url: Buffer.from('someimage') },
        category: { id: 'cat-1', name: 'Cat', description: 'desc' },
        typeRessource: { id: 'type-1', name: 'Type' },
        citizen: { id: 'citizen-1', name: 'John', surname: 'Doe' },
        step: dto.step.map((s, i) => ({ ...s, id: `step-${i + 1}` })),
      };

      mockPrisma.file.create.mockResolvedValue(mockFile);
      mockPrisma.image.create.mockResolvedValue(mockBanner);
      mockPrisma.ressource.create.mockResolvedValue(mockRessource);
      mockStepService.createMany.mockResolvedValue(undefined);
      mockPrisma.ressource.findUnique.mockResolvedValue(mockFinalRessource);

      const result = await service.create(dto as any);

      expect(mockPrisma.file.create).toHaveBeenCalled();
      expect(mockPrisma.image.create).toHaveBeenCalled();
      expect(mockPrisma.ressource.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            fileId: 'file-123',
            bannerId: 'image-456',
          }),
        }),
      );
      expect(mockStepService.createMany).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ title: 'Étape 1' })]),
      );
      expect(result).toEqual({
        data: mockFinalRessource,
        message: 'Ressources créé avec succès',
      });
    });

    it('should throw BadRequestException on P2002 error', async () => {
      mockPrisma.ressource.create.mockRejectedValue({ code: 'P2002' });

      await expect(
        service.create({ title: 'duplicate' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockPrisma.ressource.create.mockRejectedValue(new Error('Oops'));

      await expect(service.create({ title: 'unknown' } as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('RessourceService - update', () => {
    it('should update a ressource successfully', async () => {
      const dto = {
        title: 'Updated Title',
        description: 'Updated description',
      };

      const updatedRessource = {
        id: 'ressource-789',
        title: 'Updated Title',
        description: 'Updated description',
        maxParticipant: 10,
        nbParticipant: 2,
        deadLine: new Date(),
        isValidate: false,
        status: 'EN_ATTENTE',
        file: { id: 'file-123', path: Buffer.from('somefile') },
        banner: { id: 'banner-456', url: Buffer.from('someimage') },
        category: { id: 'cat-1', name: 'Cat' },
        typeRessource: { id: 'type-1', name: 'Type' },
        citizen: { id: 'citizen-1', name: 'John', surname: 'Doe' },
      };

      mockPrisma.ressource.update.mockResolvedValue(updatedRessource);

      const result = await service.update('ressource-789', dto as any);

      expect(mockPrisma.ressource.update).toHaveBeenCalledWith({
        data: dto,
        where: { id: 'ressource-789' },
        select: expect.any(Object),
      });

      expect(result).toEqual({
        data: updatedRessource,
        message: 'Ressources mis à jour avec succès',
      });
    });

    it('should throw NotFoundException if update returns null', async () => {
      mockPrisma.ressource.update.mockResolvedValue(null);

      await expect(service.update('nonexistent-id', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException on P2002 duplicate error', async () => {
      mockPrisma.ressource.update.mockRejectedValue({ code: 'P2002' });

      await expect(service.update('ressource-789', {} as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockPrisma.ressource.update.mockRejectedValue(new Error('Unexpected'));

      await expect(service.update('ressource-789', {} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('RessourceService - remove', () => {
    it('should remove a ressource successfully', async () => {
      const mockRessource = { id: 'ressource-789' };

      mockPrisma.ressource.findUnique.mockResolvedValue(mockRessource);
      mockPrisma.step.deleteMany.mockResolvedValue(undefined);
      mockPrisma.ressource.delete.mockResolvedValue(undefined);

      const result = await service.remove('ressource-789');

      expect(mockPrisma.ressource.findUnique).toHaveBeenCalledWith({
        where: { id: 'ressource-789' },
      });
      expect(mockPrisma.step.deleteMany).toHaveBeenCalledWith({
        where: { ressourceId: 'ressource-789' },
      });
      expect(mockPrisma.ressource.delete).toHaveBeenCalledWith({
        where: { id: 'ressource-789' },
      });
      expect(result).toEqual({
        data: true,
        message: 'Ressources supprimé avec succès',
      });
    });

    it('should throw NotFoundException if ressource not found', async () => {
      mockPrisma.ressource.findUnique.mockResolvedValue(null);

      await expect(service.remove('unknown-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException on P2003 error', async () => {
      const mockRessource = { id: 'ressource-789' };
      mockPrisma.ressource.findUnique.mockResolvedValue(mockRessource);
      mockPrisma.step.deleteMany.mockResolvedValue(undefined);
      mockPrisma.ressource.delete.mockRejectedValue({ code: 'P2003' });

      await expect(service.remove('ressource-789')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockPrisma.ressource.findUnique.mockImplementation(() => {
        throw new Error('Oops');
      });

      await expect(service.remove('ressource-789')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('RessourceService - findCitizenRessource', () => {
    it('should return ressources for a citizen', async () => {
      const mockCitizenId = 'citizen-123';
      const mockRessources = [
        {
          id: 'ressource-1',
          title: 'R1',
          deadLine: new Date(),
          isValidate: true,
          status: 'EN_COURS',
          citizen: {
            id: mockCitizenId,
            name: 'John',
            surname: 'Doe',
          },
        },
        {
          id: 'ressource-2',
          title: 'R2',
          deadLine: new Date(),
          isValidate: false,
          status: 'EN_ATTENTE',
          citizen: {
            id: mockCitizenId,
            name: 'John',
            surname: 'Doe',
          },
        },
      ];

      mockPrisma.ressource.findMany.mockResolvedValue(mockRessources);

      const result = await service.findCitizenRessource(mockCitizenId);

      expect(mockPrisma.ressource.findMany).toHaveBeenCalledWith({
        where: { citizenId: mockCitizenId },
        select: {
          id: true,
          title: true,
          deadLine: true,
          isValidate: true,
          status: true,
          citizen: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      });

      expect(result).toEqual({
        data: mockRessources,
        message: 'Ressources récupéré avec succès',
      });
    });

    it('should throw NotFoundException if no ressources found', async () => {
      mockPrisma.ressource.findMany.mockResolvedValue(null);

      await expect(service.findCitizenRessource('citizen-404')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockPrisma.ressource.findMany.mockRejectedValue(new Error('Oops'));

      await expect(service.findCitizenRessource('citizen-err')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('RessourceService - findAll', () => {
    it('should return paginated ressources', async () => {
      const mockRessources = [
        {
          id: 'ressource-1',
          title: 'Test',
          description: 'Description',
          maxParticipant: 10,
          nbParticipant: 2,
          deadLine: new Date(),
          isValidate: true,
          status: 'EN_COURS',
          category: { id: 'cat-1', name: 'Catégorie' },
          banner: { id: 'banner-1', url: 'url' },
          typeRessource: { id: 'type-1', name: 'Type' },
          citizen: { id: 'citizen-1', name: 'John', surname: 'Doe' },
        },
      ];
      mockPrisma.ressource.findMany.mockResolvedValue(mockRessources);
      mockPrisma.ressource.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10, 'createdAt', 'desc');

      expect(mockPrisma.ressource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
          orderBy: { createdAt: 'desc' },
        }),
      );
      expect(mockPrisma.ressource.count).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockRessources,
        total: 1,
        page: 1,
        pageSize: 10,
        message: 'Ressources récupérés avec succès',
      });
    });

    it('should throw NotFoundException if no ressources found', async () => {
      mockPrisma.ressource.findMany.mockResolvedValue([]);

      await expect(service.findAll(1, 10)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockPrisma.ressource.findMany.mockRejectedValue(new Error('Oops'));

      await expect(service.findAll(1, 10)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('RessourceService - findOne', () => {
    it('should return a single ressource', async () => {
      const mockRessource = {
        id: 'ressource-1',
        title: 'Titre',
        description: 'Description',
        maxParticipant: 10,
        nbParticipant: 2,
        deadLine: new Date(),
        isValidate: false,
        status: 'EN_ATTENTE',
        category: { id: 'cat-1', name: 'Cat' },
        file: { id: 'file-1', path: 'file-path' },
        banner: { id: 'img-1', url: 'image-url' },
        typeRessource: { id: 'type-1', name: 'Type' },
        citizen: { id: 'citizen-1', name: 'John', surname: 'Doe' },
        step: [],
        comment: [],
      };

      mockPrisma.ressource.findUnique.mockResolvedValue(mockRessource);

      const result = await service.findOne('ressource-1');

      expect(mockPrisma.ressource.findUnique).toHaveBeenCalledWith({
        where: { id: 'ressource-1' },
        select: expect.any(Object),
      });

      expect(result).toEqual({
        data: mockRessource,
        message: 'Ressources récupéré avec succès',
      });
    });

    it('should throw NotFoundException if ressource is not found', async () => {
      mockPrisma.ressource.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockPrisma.ressource.findUnique.mockRejectedValue(new Error('Oops'));

      await expect(service.findOne('ressource-error')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
