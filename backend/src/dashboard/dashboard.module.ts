import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vat } from '../vat/vat.entity';
import { DyeLot } from '../dye-lot/dye-lot.entity';
import { FastnessTest } from '../fastness-test/fastness-test.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vat, DyeLot, FastnessTest])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
