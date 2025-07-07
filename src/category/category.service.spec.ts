/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: PrismaService;

  const mockPrisma = {
    category: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a category successfully', async () => {
    const dto = {
      name: 'Test Category',
      description: 'Test Category Description',
    };

    const fakeCategory = {
      id: 'category-123',
      name: 'Test Category',
      description: 'Test Category Description',
    };

    mockPrisma.category.create.mockResolvedValue(fakeCategory);

    const result = await service.create(dto as any);

    expect(result).toEqual({
      data: fakeCategory,
      message: 'Catégorie créé avec succès',
    });
  });

  it('should throw BadRequestException on duplicate error (P2002)', async () => {
    const dto = { name: 'Duplicate Category' };

    mockPrisma.category.create.mockRejectedValue({ code: 'P2002' });

    await expect(service.create(dto as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw InternalServerErrorException if an unknown error occurs', async () => {
    const dto = { name: 'Test Category' };

    mockPrisma.category.create.mockRejectedValue(new Error('Unknown error'));

    await expect(service.create(dto as any)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should get all categories successfully', async () => {
    const fakeCategories = [
      { id: 'category-123', name: 'Category 1', description: 'Description 1' },
      { id: 'category-124', name: 'Category 2', description: 'Description 2' },
    ];

    mockPrisma.category.findMany.mockResolvedValue(fakeCategories);
    mockPrisma.category.count.mockResolvedValue(2);

    const result = await service.findAll();

    expect(result).toEqual({
      data: fakeCategories,
      total: 2,
      message: 'Catégories récupérés avec succès',
    });
  });

  it('should throw NotFoundException if no categories found in findAll', async () => {
    mockPrisma.category.findMany.mockResolvedValue([]);
    mockPrisma.category.count.mockResolvedValue(0);

    await expect(service.findAll()).rejects.toThrow(NotFoundException);
  });

  it('should get a category by id successfully', async () => {
    const fakeCategory = {
      id: 'category-123',
      name: 'Test Category',
      description: 'Test Description',
    };

    mockPrisma.category.findUnique.mockResolvedValue(fakeCategory);

    const result = await service.findOne('category-123');

    expect(result).toEqual({
      data: fakeCategory,
      message: 'Catégorie récupéré avec succès',
    });
  });

  it('should throw NotFoundException if category not found in findOne', async () => {
    mockPrisma.category.findUnique.mockResolvedValue(null);

    await expect(service.findOne('nonexistent-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a category successfully', async () => {
    const dto = {
      name: 'Updated Category',
      description: 'Updated Description',
    };

    const fakeCategory = {
      id: 'category-123',
      name: 'Updated Category',
      description: 'Updated Description',
    };

    mockPrisma.category.update.mockResolvedValue(fakeCategory);

    const result = await service.update('category-123', dto as any);

    expect(result).toEqual({
      data: fakeCategory,
      message: 'Catégorie mis à jour avec succès',
    });
  });

  it('should throw NotFoundException if category not found for update', async () => {
    const dto = { name: 'Updated Category' };

    mockPrisma.category.update.mockResolvedValue(null);

    await expect(service.update('nonexistent-id', dto as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException on duplicate error (P2002) during update', async () => {
    const dto = { name: 'Updated Category' };

    mockPrisma.category.update.mockRejectedValue({ code: 'P2002' });

    await expect(service.update('category-123', dto as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should delete a category successfully', async () => {
    const fakeCategory = {
      id: 'category-123',
      name: 'Test Category',
      description: 'Test Category Description',
    };

    mockPrisma.category.findUnique.mockResolvedValue(fakeCategory);
    mockPrisma.category.delete.mockResolvedValue(fakeCategory);

    const result = await service.remove('category-123');

    expect(result).toEqual({
      message: 'Catégorie supprimé avec succès',
    });
  });

  it('should throw NotFoundException if category not found for deletion', async () => {
    mockPrisma.category.findUnique.mockResolvedValue(null);

    await expect(service.remove('nonexistent-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException if there is a dependency constraint during deletion', async () => {
    mockPrisma.category.findUnique.mockResolvedValue({ id: 'category-123' });
    mockPrisma.category.delete.mockRejectedValue({ code: 'P2003' });

    await expect(service.remove('category-123')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw InternalServerErrorException if an unknown error occurs during deletion', async () => {
    mockPrisma.category.findUnique.mockResolvedValue({ id: 'category-123' });
    mockPrisma.category.delete.mockRejectedValue(new Error('Unknown error'));

    await expect(service.remove('category-123')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
