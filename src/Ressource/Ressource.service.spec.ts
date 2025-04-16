import { Test, TestingModule } from '@nestjs/testing';
import { RessourceService } from './Ressource.service';
import { PrismaService } from 'src/prisma.service';

describe('RessourceService', () => {
  let service: RessourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RessourceService, PrismaService],
    }).compile();

    service = module.get<RessourceService>(RessourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
