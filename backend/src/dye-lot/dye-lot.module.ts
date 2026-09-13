import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DyeLot } from './dye-lot.entity';
import { DyeLotService } from './dye-lot.service';
import { DyeLotController } from './dye-lot.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DyeLot])],
  controllers: [DyeLotController],
  providers: [DyeLotService],
  exports: [DyeLotService],
})
export class DyeLotModule {}
