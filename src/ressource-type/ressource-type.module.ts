import { Module } from '@nestjs/common';
import { RessourceTypeService } from './ressource-type.service';
import { RessourceTypeController } from './ressource-type.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RessourceTypeController],
  providers: [RessourceTypeService, PrismaService],
})
export class RessourceTypeModule {}