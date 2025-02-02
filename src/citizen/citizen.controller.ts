import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CitizenService } from './citizen.service';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';
import { Role as RoleModel, Citizen as CitizenModel } from '@prisma/client';

interface OneCitizen extends Omit<CitizenModel, 'id' | 'password' | 'roleId'> {
  role: Omit<RoleModel, 'id'>;
}

@Controller('citizen')
export class CitizenController {
  constructor(private citizenService: CitizenService) {}

  @Post()
  create(@Body() createCitizenDto: CreateCitizenDto) {
    return this.citizenService.create(createCitizenDto);
  }

  @Get()
  findAll(): Promise<OneCitizen[]> {
    return this.citizenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<OneCitizen | null> {
    return this.citizenService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCitizenDto: UpdateCitizenDto,
  ): Promise<String> {
    return this.citizenService.update(id, updateCitizenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<String> {
    return this.citizenService.remove(id);
  }
}
