import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { InviteType } from 'src/utils/types/PrismaApiModel.type';

@Controller('Invite')
export class InviteController {
  constructor(private readonly InviteService: InviteService) {}

  @Post()
  create(@Body() createInviteDto: CreateInviteDto) : Promise<ApiReturns<InviteType | null>> {
    return this.InviteService.create(createInviteDto);
  }

  @Get()
    findAll(
      @Query('citizenId') citizenId: string | undefined,
    ): Promise<ApiReturns<InviteType[] | null>> {
      return this.InviteService.findAll(
        citizenId
      );
    }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.InviteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInviteDto: UpdateInviteDto) {
    return this.InviteService.update(id, updateInviteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.InviteService.remove(id);
  }
}
