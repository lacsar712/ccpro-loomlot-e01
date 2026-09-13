import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FastnessTest } from './fastness-test.entity';
import { FastnessTestService } from './fastness-test.service';
import { FastnessTestController } from './fastness-test.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FastnessTest])],
  controllers: [FastnessTestController],
  providers: [FastnessTestService],
  exports: [FastnessTestService],
})
export class FastnessTestModule {}
