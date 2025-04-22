import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RessourceTypeService } from './ressource-type.service';
import { CreateRessourceTypeDto } from './dto/create-ressource-type.dto';
import { UpdateRessourceTypeDto } from './dto/update-ressource-type.dto';

@Controller('ressource-type')
export class RessourceTypeController {
  constructor(private readonly ressourceTypeService: RessourceTypeService) {}

  // POST /ressource-types : Créer un nouveau RessourceType
  @Post()
  async create(@Body() dto: CreateRessourceTypeDto) {
    return await this.ressourceTypeService.createRessourceType(dto);
  }

  // PATCH /ressource-types/:id : Mettre à jour un RessourceType
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRessourceTypeDto,
  ) {
    return await this.ressourceTypeService.updateRessourceType(id, dto);
  }

  // GET /ressource-types : Obtenir la liste de tous les RessourceType
  @Get()
  async findAll() {
    return await this.ressourceTypeService.findAll();
  }

  // GET /ressource-types/:id : Obtenir un RessourceType par son id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ressourceTypeService.findOne(id);
  }

  // DELETE /ressource-types/:id : Supprimer un RessourceType
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.ressourceTypeService.deleteRessourceType(id);
  }
}
