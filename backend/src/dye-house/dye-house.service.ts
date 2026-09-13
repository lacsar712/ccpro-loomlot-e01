import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DyeHouse } from './dye-house.entity';
import { CreateDyeHouseDto, UpdateDyeHouseDto } from './dto/dye-house.dto';

@Injectable()
export class DyeHouseService {
  constructor(
    @InjectRepository(DyeHouse)
    private readonly repo: Repository<DyeHouse>,
  ) {}

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('染坊不存在');
    return row;
  }

  create(dto: CreateDyeHouseDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateDyeHouseDto) {
    const row = await this.findOne(id);
    Object.assign(row, dto);
    return this.repo.save(row);
  }

  async remove(id: number) {
    const row = await this.findOne(id);
    await this.repo.remove(row);
    return { ok: true };
  }
}
