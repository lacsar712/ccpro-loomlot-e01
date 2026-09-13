import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vat } from './vat.entity';
import { CreateVatDto, UpdateVatDto } from './dto/vat.dto';

@Injectable()
export class VatService {
  constructor(
    @InjectRepository(Vat)
    private readonly repo: Repository<Vat>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['dyeHouse'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const row = await this.repo.findOne({
      where: { id },
      relations: ['dyeHouse'],
    });
    if (!row) throw new NotFoundException('染缸不存在');
    return row;
  }

  async create(dto: CreateVatDto) {
    const exists = await this.repo.findOne({
      where: { dyeHouseId: dto.dyeHouseId, vatCode: dto.vatCode },
    });
    if (exists) {
      throw new ConflictException('同厂染缸编号已存在');
    }
    return this.repo.save(
      this.repo.create({
        ...dto,
        status: dto.status || 'ready',
      }),
    );
  }

  async update(id: number, dto: UpdateVatDto) {
    const row = await this.findOne(id);
    const dyeHouseId = dto.dyeHouseId ?? row.dyeHouseId;
    const vatCode = dto.vatCode ?? row.vatCode;
    if (dyeHouseId !== row.dyeHouseId || vatCode !== row.vatCode) {
      const exists = await this.repo.findOne({
        where: { dyeHouseId, vatCode },
      });
      if (exists && exists.id !== id) {
        throw new ConflictException('同厂染缸编号已存在');
      }
    }
    Object.assign(row, dto);
    return this.repo.save(row);
  }

  async remove(id: number) {
    const row = await this.findOne(id);
    await this.repo.remove(row);
    return { ok: true };
  }
}
