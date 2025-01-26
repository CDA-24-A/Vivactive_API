import { IsNotEmpty } from 'class-validator';

export class CreateCitizenDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  surname: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  //   @IsNotEmpty()
  //   roleId: string;
}
