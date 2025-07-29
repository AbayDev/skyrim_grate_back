import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { DifficultyLevel } from 'src/shared/enums/difficulty-level.enum';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  dateStart: Date;

  @IsOptional()
  @IsDate()
  dateWStart: Date;

  @IsOptional()
  @IsDate()
  dateEnd: Date;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  level: DifficultyLevel;

  @IsOptional()
  @IsString()
  iconName: string;
}
