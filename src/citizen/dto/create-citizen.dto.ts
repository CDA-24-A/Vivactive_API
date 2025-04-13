import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCitizenDto {
  @IsNotEmpty()
  @IsOptional()
  clerkId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsOptional()
  roleId: string;
}
