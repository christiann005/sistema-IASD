import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class GroupAttendanceDto {
  @IsDateString()
  date: string;

  @IsInt()
  @Min(0)
  count: number;
}

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  hostName?: string;

  @IsString()
  leader: string;

  @IsOptional()
  @IsArray()
  members?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupAttendanceDto)
  attendances?: GroupAttendanceDto[];
}
