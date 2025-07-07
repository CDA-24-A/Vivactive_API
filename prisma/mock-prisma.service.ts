import { PrismaClient } from '@prisma/client';

export const mockPrisma = {
  citizen: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  role: {
    findUnique: jest.fn(),
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
} as unknown as PrismaClient;
