import { IsNotEmpty } from 'class-validator';

export class CreateInviteDto {
  @IsNotEmpty()
  accept: boolean;
  @IsNotEmpty()
  senderId: string;
  receverId: string;
  createdAt: Date;
}
