import { Test, TestingModule } from '@nestjs/testing';
import { CitizenController } from './citizen.controller';
import { CitizenService } from './citizen.service';
import { PrismaService } from 'src/prisma.service';

describe('CitizenController', () => {
  let controller: CitizenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitizenController],
      providers: [CitizenService, PrismaService],
    }).compile();

    controller = module.get<CitizenController>(CitizenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
