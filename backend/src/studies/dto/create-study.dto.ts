import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudyDto {
  @IsString()
  @IsNotEmpty()
  lesson: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  group?: string;

  @IsString()
  leader: string;

  @IsOptional()
  @IsString()
  decisions?: string;
}
