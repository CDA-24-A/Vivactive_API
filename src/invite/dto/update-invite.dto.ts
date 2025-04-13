import { PartialType } from '@nestjs/mapped-types';
import { CreateInviteDto } from './create-invite.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateInviteDto extends PartialType(CreateInviteDto) {
  @IsNotEmpty()
  @IsOptional()
  accept: boolean;
}
