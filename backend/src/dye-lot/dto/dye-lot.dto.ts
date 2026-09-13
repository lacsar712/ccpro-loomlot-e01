import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

const LOT_STATUSES = [
  'queued',
  'running',
  'rinsing',
  'done',
  'rework',
] as const;

export class CreateDyeLotDto {
  @Type(() => Number)
  @IsNumber()
  vatId: number;

  @IsString()
  @MinLength(1)
  lotCode: string;

  @IsString()
  @MinLength(1)
  fabricType: string;

  @IsString()
  @MinLength(1)
  colorName: string;

  @IsDateString()
  startAt: string;

  @IsOptional()
  @IsEnum(LOT_STATUSES)
  status?: (typeof LOT_STATUSES)[number];
}

export class UpdateDyeLotDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  vatId?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  lotCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  fabricType?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  colorName?: string;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsEnum(LOT_STATUSES)
  status?: (typeof LOT_STATUSES)[number];
}
