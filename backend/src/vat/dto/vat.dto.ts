import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

const VAT_STATUSES = ['ready', 'busy', 'maintenance'] as const;

export class CreateVatDto {
  @Type(() => Number)
  @IsNumber()
  dyeHouseId: number;

  @IsString()
  @MinLength(1)
  vatCode: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  capacityKg: number;

  @IsOptional()
  @IsEnum(VAT_STATUSES)
  status?: (typeof VAT_STATUSES)[number];
}

export class UpdateVatDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  dyeHouseId?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  vatCode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  capacityKg?: number;

  @IsOptional()
  @IsEnum(VAT_STATUSES)
  status?: (typeof VAT_STATUSES)[number];
}
