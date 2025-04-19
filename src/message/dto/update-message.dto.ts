import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @IsNotEmpty()
  @IsOptional()
  message: string;
}
