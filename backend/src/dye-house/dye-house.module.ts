import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DyeHouse } from './dye-house.entity';
import { DyeHouseService } from './dye-house.service';
import { DyeHouseController } from './dye-house.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DyeHouse])],
  controllers: [DyeHouseController],
  providers: [DyeHouseService],
  exports: [DyeHouseService],
})
export class DyeHouseModule {}
