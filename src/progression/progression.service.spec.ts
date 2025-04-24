/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ProgressionService } from './progression.service';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('ProgressionService', () => {
  let service: ProgressionService;
  let prisma: PrismaService;

  const mockPrisma = {
    progression: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    ressource: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    step: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressionService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProgressionService>(ProgressionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should initialize progression successfully', async () => {
    const dto = {
      citizenId: 'citizen-123',
      ressourceId: 'ressource-123',
    };

    const fakeSteps = [{ id: 'step-1', ressourceId: 'ressource-123' }];

    const fakeProgression = [
      { id: 'progression-1', citizenId: 'citizen-123', stepId: 'step-1' },
    ];

    const fakeRessource = {
      id: 'ressource-123',
      maxParticipant: 10,
      nbParticipant: 5,
    };

    mockPrisma.step.findMany.mockResolvedValue(fakeSteps);
    mockPrisma.progression.findFirst.mockResolvedValue(null);
    mockPrisma.progression.create.mockResolvedValue(fakeProgression[0]);
    mockPrisma.ressource.findUnique.mockResolvedValue(fakeRessource);
    mockPrisma.ressource.update.mockResolvedValue(fakeRessource);

    const result = await service.initializeProgression(dto);
    console.log(result);
    expect(result).toEqual({
      data: fakeProgression,
      message: 'Progression initialisé avec succès',
    });
  });

  it('should throw NotFoundException if no steps are found in initializeProgression', async () => {
    const dto = {
      citizenId: 'citizen-123',
      ressourceId: 'ressource-123',
    };

    mockPrisma.step.findMany.mockResolvedValue([]);

    await expect(service.initializeProgression(dto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException if citizen is already in a progression', async () => {
    const dto = {
      citizenId: 'citizen-123',
      ressourceId: 'ressource-123',
    };

    mockPrisma.progression.findFirst.mockResolvedValue({
      id: 'progression-123',
    });

    await expect(service.initializeProgression(dto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException if a progression already exists for the citizen and step', async () => {
    const dto = {
      citizenId: 'citizen-123',
      ressourceId: 'ressource-123',
    };

    const fakeSteps = [{ id: 'step-1', ressourceId: 'ressource-123' }];

    mockPrisma.step.findMany.mockResolvedValue(fakeSteps);
    mockPrisma.progression.findFirst.mockResolvedValue({
      citizenId: 'citizen-123',
      stepId: 'step-1',
      completed: false,
    });

    await expect(service.initializeProgression(dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException if maxParticipants are reached', async () => {
    const dto = {
      citizenId: 'citizen-123',
      ressourceId: 'ressource-123',
    };

    const fakeSteps = [{ id: 'step-1', ressourceId: 'ressource-123' }];

    const fakeRessource = {
      id: 'ressource-123',
      maxParticipant: 1,
      nbParticipant: 1,
    };

    mockPrisma.step.findMany.mockResolvedValue(fakeSteps);
    mockPrisma.progression.findFirst.mockResolvedValue(null);
    mockPrisma.ressource.findUnique.mockResolvedValue(fakeRessource);

    await expect(service.initializeProgression(dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw InternalServerErrorException if progression creation fails', async () => {
    const dto = {
      citizenId: 'citizen-123',
      ressourceId: 'ressource-123',
    };

    const fakeSteps = [{ id: 'step-1', ressourceId: 'ressource-123' }];

    const fakeRessource = {
      id: 'ressource-123',
      maxParticipant: 10,
      nbParticipant: 5,
    };

    mockPrisma.step.findMany.mockResolvedValue(fakeSteps);
    mockPrisma.progression.findFirst.mockResolvedValue(null);
    mockPrisma.progression.create.mockRejectedValue(
      new InternalServerErrorException(),
    );
    mockPrisma.ressource.findUnique.mockResolvedValue(fakeRessource);

    await expect(service.initializeProgression(dto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should get progression successfully', async () => {
    const citizenId = 'citizen-123';
    const fakeProgression = [
      { id: 'progression-1', citizenId: 'citizen-123', stepId: 'step-1' },
      { id: 'progression-2', citizenId: 'citizen-123', stepId: 'step-2' },
    ];

    mockPrisma.progression.findMany.mockResolvedValue(fakeProgression);

    const result = await service.getProgression(citizenId);

    expect(result).toEqual({
      data: fakeProgression,
      message: 'Progression créé et récupéré avec succès',
    });
  });

  it('should throw BadRequestException if citizenId is not provided in getProgression', async () => {
    await expect(service.getProgression('')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw InternalServerErrorException if an error occurs in getProgression', async () => {
    mockPrisma.progression.findMany.mockRejectedValue(
      new Error('Unknown error'),
    );

    await expect(service.getProgression('citizen-123')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
  it('should update progression successfully', async () => {
    const dto = { completed: true, dateCompleted: new Date() };
    const progressionId = 'progression-123';

    const fakeProgression = {
      id: progressionId,
      citizenId: 'citizen-123',
      stepId: 'step-1',
      completed: false,
    };

    mockPrisma.progression.findUnique.mockResolvedValue(fakeProgression);
    mockPrisma.progression.update.mockResolvedValue({
      ...fakeProgression,
      completed: dto.completed,
      dateCompleted: new Date(),
    });

    const result = await service.updateProgression(progressionId, dto);

    expect(result).toEqual({
      data: {
        ...fakeProgression,
        completed: dto.completed,
        dateCompleted: expect.any(Date),
      },
      message: 'Progression complétée avec succès',
    });
  });

  it('should throw NotFoundException if progression is not found for update', async () => {
    const dto = { completed: true, dateCompleted: new Date() };
    const progressionId = 'progression-123';

    mockPrisma.progression.findUnique.mockResolvedValue(null);

    await expect(service.updateProgression(progressionId, dto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw InternalServerErrorException if progression update fails', async () => {
    const dto = { completed: true, dateCompleted: new Date() };
    const progressionId = 'progression-123';

    const fakeProgression = {
      id: progressionId,
      citizenId: 'citizen-123',
      stepId: 'step-1',
      completed: false,
    };

    mockPrisma.progression.findUnique.mockResolvedValue(fakeProgression);
    mockPrisma.progression.update.mockRejectedValue(new Error('Unknown error'));

    await expect(service.updateProgression(progressionId, dto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw NotFoundException if no progression found for deletion', async () => {
    const citizenId = 'citizen-123';

    mockPrisma.progression.findFirst.mockResolvedValue(null);

    const result = await service.deleteProgression(citizenId);

    expect(result).toEqual({
      data: [],
      message: 'Aucune progression à supprimer',
    });
  });

  it('should throw NotFoundException if ressource is not found during deleteProgression', async () => {
    const citizenId = 'citizen-123';

    const fakeProgression = { ressourceId: 'ressource-123' };

    mockPrisma.progression.findFirst.mockResolvedValue(fakeProgression);
    mockPrisma.ressource.findUnique.mockResolvedValue(null);

    await expect(service.deleteProgression(citizenId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException if nbParticipant is already zero during deleteProgression', async () => {
    const citizenId = 'citizen-123';

    const fakeProgression = { ressourceId: 'ressource-123' };

    const fakeRessource = { nbParticipant: 0 };

    mockPrisma.progression.findFirst.mockResolvedValue(fakeProgression);
    mockPrisma.ressource.findUnique.mockResolvedValue(fakeRessource);

    await expect(service.deleteProgression(citizenId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw InternalServerErrorException if deleteProgression fails', async () => {
    const citizenId = 'citizen-123';

    mockPrisma.progression.findFirst.mockRejectedValue(
      new Error('Unknown error'),
    );

    await expect(service.deleteProgression(citizenId)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
