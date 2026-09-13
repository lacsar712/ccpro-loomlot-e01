import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vat } from './vat.entity';
import { VatService } from './vat.service';
import { VatController } from './vat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vat])],
  controllers: [VatController],
  providers: [VatService],
  exports: [VatService],
})
export class VatModule {}
