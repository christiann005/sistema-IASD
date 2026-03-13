import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateStudyDto {
  @IsOptional()
  @IsString()
  lesson?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  group?: string;

  @IsOptional()
  @IsString()
  leader?: string;

  @IsOptional()
  @IsString()
  decisions?: string;
}
