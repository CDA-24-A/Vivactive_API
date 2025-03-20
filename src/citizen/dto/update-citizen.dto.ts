import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCitizenDto {
  @IsNotEmpty()
  @IsOptional()
  clerkId: string;

  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  surname: string;

  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsNotEmpty()
  @IsOptional()
  password: string;

  @IsNotEmpty()
  @IsOptional()
  roleId: string;
}
