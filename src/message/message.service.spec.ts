import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { PrismaService } from 'src/prisma.service';
import {
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { RessourceService } from 'src/Ressource/Ressource.service';
import { ProgressionService } from 'src/progression/progression.service';

describe('MessageService', () => {
  let service: MessageService;
  let prisma: PrismaService;

  const mockRessourceService = {
    isRessourceInProgress: jest.fn(),
  };

  const mockProgressionService = {
    hasProgression: jest.fn(),
  };

  const mockPrisma = {
    message: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RessourceService, useValue: mockRessourceService },
        { provide: ProgressionService, useValue: mockProgressionService },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  const createDto = {
    message: 'Hello world',
    ressourceId: 'res-123',
    citizenId: 'citizen-123',
  };

  const fakeMessage = {
    id: 'msg-123',
    message: 'Hello world',
    updatedAt: new Date(),
    ressourceId: 'res-123',
    citizen: {
      id: 'citizen-123',
      name: 'John',
      surname: 'Doe',
    },
  };

  it('should create a message successfully', async () => {
    mockRessourceService.isRessourceInProgress.mockResolvedValue(true);
    mockProgressionService.hasProgression.mockResolvedValue(true);
    mockPrisma.message.create.mockResolvedValue(fakeMessage);

    const result = await service.create(createDto as any);

    expect(result).toEqual({
      data: fakeMessage,
      message: 'Message créé avec succès',
    });
  });

  it("should throw ForbiddenException if ressource isn't in progress", async () => {
    mockRessourceService.isRessourceInProgress.mockResolvedValue(false);

    await expect(service.create(createDto as any)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw ForbiddenException if citizen is not registered to the ressource', async () => {
    mockRessourceService.isRessourceInProgress.mockResolvedValue(true);
    mockProgressionService.hasProgression.mockResolvedValue(false);

    await expect(service.create(createDto as any)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw InternalServerErrorException if Prisma returns null', async () => {
    mockRessourceService.isRessourceInProgress.mockResolvedValue(true);
    mockProgressionService.hasProgression.mockResolvedValue(true);
    mockPrisma.message.create.mockResolvedValue(null);

    await expect(service.create(createDto as any)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw BadRequestException on duplicate error (P2002)', async () => {
    mockRessourceService.isRessourceInProgress.mockResolvedValue(true);
    mockProgressionService.hasProgression.mockResolvedValue(true);
    mockPrisma.message.create.mockRejectedValue({ code: 'P2002' });

    await expect(service.create(createDto as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw InternalServerErrorException on unknown error', async () => {
    mockRessourceService.isRessourceInProgress.mockResolvedValue(true);
    mockProgressionService.hasProgression.mockResolvedValue(true);
    mockPrisma.message.create.mockRejectedValue(new Error('Unexpected error'));

    await expect(service.create(createDto as any)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
