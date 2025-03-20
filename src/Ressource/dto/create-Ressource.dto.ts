import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDateString,
} from 'class-validator';

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

  @IsOptional()
  fileId?: string;

  @IsOptional()
  bannerId?: string;

  @IsOptional()
  @IsBoolean()
  isValidate: boolean;

  @IsOptional()
  status: string;
}
