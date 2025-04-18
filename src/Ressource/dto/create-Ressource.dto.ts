import { IsNotEmpty, IsOptional, IsInt, IsBoolean, IsDateString, IsString } from 'class-validator';

export class CreateRessourceDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsInt()
  maxParticipant?: number;

  @IsOptional()
  @IsInt()
  nbParticipant?: number;

  @IsOptional()
  @IsDateString()
  deadLine?: Date;

  @IsOptional()
  categoryId: string;
  
  @IsNotEmpty()
  ressourceTypeId: string;

  @IsOptional()
  @IsBoolean()
  isValidate: boolean;

  @IsOptional()
  status: string;

  // ➕ Nouveaux champs : les images en base64 ou bytes
  @IsOptional()
  @IsString()
  fileBytes?: string;

  @IsOptional()
  @IsString()
  bannerBytes?: string;
}
