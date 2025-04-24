import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class UpdateRessourceDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsInt()
  maxParticipant: number;

  @IsOptional()
  @IsInt()
  nbParticipant: number;

  @IsOptional()
  @IsDateString()
  deadLine: Date;

  @IsOptional()
  typeRessourceId: string;

  @IsOptional()
  categoryId: string;

  @IsOptional()
  fileId: string;

  @IsOptional()
  bannerId: string;

  @IsOptional()
  @IsBoolean()
  isValidate: boolean;

  @IsOptional()
  status: string;
}
