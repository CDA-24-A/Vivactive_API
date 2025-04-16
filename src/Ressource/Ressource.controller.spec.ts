import { Test, TestingModule } from '@nestjs/testing';
import { RessourceController } from './Ressource.controller';
import { RessourceService } from './Ressource.service';
import { PrismaService } from 'src/prisma.service';

describe('RessourceController', () => {
  let controller: RessourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RessourceController],
      providers: [RessourceService, PrismaService],
    }).compile();

    controller = module.get<RessourceController>(RessourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
