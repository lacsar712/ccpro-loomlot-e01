import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FastnessTest } from './fastness-test.entity';
import {
  CreateFastnessTestDto,
  UpdateFastnessTestDto,
} from './dto/fastness-test.dto';

@Injectable()
export class FastnessTestService {
  constructor(
    @InjectRepository(FastnessTest)
    private readonly repo: Repository<FastnessTest>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['dyeLot', 'dyeLot.vat'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const row = await this.repo.findOne({
      where: { id },
      relations: ['dyeLot', 'dyeLot.vat'],
    });
    if (!row) throw new NotFoundException('色牢度检测记录不存在');
    return row;
  }

  create(dto: CreateFastnessTestDto) {
    return this.repo.save(
      this.repo.create({
        ...dto,
        testedAt: new Date(dto.testedAt),
      }),
    );
  }

  async update(id: number, dto: UpdateFastnessTestDto) {
    const row = await this.findOne(id);
    Object.assign(row, {
      ...dto,
      testedAt: dto.testedAt ? new Date(dto.testedAt) : row.testedAt,
    });
    return this.repo.save(row);
  }

  async remove(id: number) {
    const row = await this.findOne(id);
    await this.repo.remove(row);
    return { ok: true };
  }
}
