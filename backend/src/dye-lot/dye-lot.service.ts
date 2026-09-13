import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DyeLot } from './dye-lot.entity';
import { CreateDyeLotDto, UpdateDyeLotDto } from './dto/dye-lot.dto';

@Injectable()
export class DyeLotService {
  constructor(
    @InjectRepository(DyeLot)
    private readonly repo: Repository<DyeLot>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['vat', 'vat.dyeHouse'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const row = await this.repo.findOne({
      where: { id },
      relations: ['vat', 'vat.dyeHouse'],
    });
    if (!row) throw new NotFoundException('染批不存在');
    return row;
  }

  create(dto: CreateDyeLotDto) {
    return this.repo.save(
      this.repo.create({
        ...dto,
        startAt: new Date(dto.startAt),
        status: dto.status || 'queued',
      }),
    );
  }

  async update(id: number, dto: UpdateDyeLotDto) {
    const row = await this.findOne(id);
    Object.assign(row, {
      ...dto,
      startAt: dto.startAt ? new Date(dto.startAt) : row.startAt,
    });
    return this.repo.save(row);
  }

  async remove(id: number) {
    const row = await this.findOne(id);
    await this.repo.remove(row);
    return { ok: true };
  }
}
