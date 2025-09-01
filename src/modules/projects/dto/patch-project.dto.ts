import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { DifficultyLevel } from 'src/shared/enums/difficulty-level.enum';

export class PatchProjectDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  dateStart: string;

  @IsOptional()
  @IsDate()
  dateWStart: string;

  @IsOptional()
  @IsDate()
  dateEnd: string;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  level: DifficultyLevel;

  @IsOptional()
  @IsString()
  iconName: string;
}
