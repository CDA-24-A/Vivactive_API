import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCitizenDto {
  @IsNotEmpty()
  clerkId: string;

  @IsOptional()
  name: string;

  @IsOptional()
  surname: string;

  @IsOptional()
  roleId: string;
}

export class UpdateCitizenCredentialsDto extends UpdateCitizenDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  clerkId: string;
}
