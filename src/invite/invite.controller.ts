import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  create(
    @Body() createInviteDto: CreateInviteDto,
  ): Promise<ApiReturns<InviteType | null>> {
    return this.InviteService.create(createInviteDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.InviteService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.InviteService.remove(id);
  }
}
