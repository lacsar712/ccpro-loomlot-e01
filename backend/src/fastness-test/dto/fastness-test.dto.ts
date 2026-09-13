import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFastnessTestDto {
  @Type(() => Number)
  @IsNumber()
  dyeLotId: number;

  @IsDateString()
  testedAt: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  washRating: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rubRating: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  lightRating: number;

  @IsBoolean()
  pass: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateFastnessTestDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  dyeLotId?: number;

  @IsOptional()
  @IsDateString()
  testedAt?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  washRating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rubRating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  lightRating?: number;

  @IsOptional()
  @IsBoolean()
  pass?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
