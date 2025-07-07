/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { CitizenService } from './citizen.service';
import { PrismaService } from 'src/prisma.service';
import { ClerkService } from 'src/auth/clerk.service';
import { BadRequestException } from '@nestjs/common';

describe('CitizenService', () => {
  let service: CitizenService;
  let prisma: PrismaService;
  let clerkService: ClerkService;

  const mockPrisma = {
    role: {
      findUnique: jest.fn(),
    },
    citizen: {
      create: jest.fn(),
    },
  } as any;

  const mockClerkService = {
    getClerkUser: jest.fn(),
    createClerkUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitizenService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ClerkService, useValue: mockClerkService },
      ],
    }).compile();

    service = module.get<CitizenService>(CitizenService);
    prisma = module.get<PrismaService>(PrismaService);
    clerkService = module.get<ClerkService>(ClerkService);
  });

  it('should create a citizen successfully', async () => {
    const dto = {
      email: 'test@example.com',
      name: 'Test',
      surname: 'User',
    };

    const fakeClerkUser = {
      id: 'clerk-123',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    };

    const fakeCitizen = {
      id: 'citizen-123',
      email: 'test@example.com',
      name: 'Test',
      surname: 'User',
      role: { id: 'role-1', name: 'USER' },
    };

    mockClerkService.getClerkUser.mockResolvedValue(undefined);
    mockClerkService.createClerkUser.mockResolvedValue(fakeClerkUser);
    mockPrisma.role.findUnique.mockResolvedValue({ id: 'role-1' });
    mockPrisma.citizen.create.mockResolvedValue(fakeCitizen);

    const result = await service.create(dto as any);

    expect(result).toEqual({
      data: fakeCitizen,
      message: 'Citoyen créé avec succès',
    });
  });

  it('should throw BadRequestException on duplicate error (P2002)', async () => {
    const dto = { email: 'dup@example.com' };

    mockClerkService.getClerkUser.mockResolvedValue(null);
    mockClerkService.createClerkUser.mockResolvedValue({
      id: 'clerk-dup',
      firstName: '',
      lastName: '',
      emailAddresses: [{ emailAddress: 'dup@example.com' }],
    });

    mockPrisma.role.findUnique.mockResolvedValue({ id: 'role-1' });
    mockPrisma.citizen.create.mockRejectedValue({ code: 'P2002' });

    await expect(service.create(dto as any)).rejects.toThrow(
      BadRequestException,
    );
  });
});
