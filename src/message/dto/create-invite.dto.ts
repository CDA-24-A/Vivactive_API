import { IsNotEmpty } from 'class-validator';

export class CreateInviteDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  citizenId: string;
}
