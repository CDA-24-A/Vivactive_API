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
import { ApiReturns } from 'src/utils/types/ApiReturns.type';

interface Citizen extends Omit<CitizenModel, 'id' | 'password' | 'roleId'> {
  role: Omit<RoleModel, 'id'>;
}

@Controller('citizen')
export class CitizenController {
  constructor(private citizenService: CitizenService) {}

  @Post()
  create(
    @Body() createCitizenDto: CreateCitizenDto,
  ): Promise<ApiReturns<Citizen | null>> {
    return this.citizenService.create(createCitizenDto);
  }

  @Get()
  findAll(): Promise<ApiReturns<Citizen[] | null>> {
    return this.citizenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiReturns<Citizen | null>> {
    return this.citizenService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCitizenDto: UpdateCitizenDto,
  ): Promise<ApiReturns<Citizen>> {
    return this.citizenService.update(id, updateCitizenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<String | { message: string }> {
    return this.citizenService.remove(id);
  }
}
