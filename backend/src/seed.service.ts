import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './users/user.entity';
import { DyeHouse } from './dye-house/dye-house.entity';
import { Vat } from './vat/vat.entity';
import { DyeLot } from './dye-lot/dye-lot.entity';
import { FastnessTest } from './fastness-test/fastness-test.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(DyeHouse)
    private readonly houseRepo: Repository<DyeHouse>,
    @InjectRepository(Vat)
    private readonly vatRepo: Repository<Vat>,
    @InjectRepository(DyeLot)
    private readonly lotRepo: Repository<DyeLot>,
    @InjectRepository(FastnessTest)
    private readonly testRepo: Repository<FastnessTest>,
  ) {}

  async run() {
    const userCount = await this.userRepo.count();
    if (userCount > 0) {
      this.logger.log('Seed skipped: data already present');
      return;
    }

    this.logger.log('Seeding LoomLot demo data...');
    const hash = await bcrypt.hash('123456', 10);

    await this.userRepo.save([
      this.userRepo.create({
        username: 'admin',
        passwordHash: hash,
        role: 'admin',
        displayName: '系统管理员',
      }),
      this.userRepo.create({
        username: 'dyer',
        passwordHash: hash,
        role: 'dyer',
        displayName: '染程操作员',
      }),
    ]);

    const houseA = await this.houseRepo.save(
      this.houseRepo.create({
        name: '江南一号染坊',
        address: '江苏省苏州市吴江区盛泽镇染整路 18 号',
        notes: '主攻靛蓝缸染与色牢度抽检',
      }),
    );
    const houseB = await this.houseRepo.save(
      this.houseRepo.create({
        name: '绛红工场',
        address: '浙江省嘉兴市海宁经编园区 3 号',
        notes: '侧重深色系与复染返工',
      }),
    );

    const vats = await this.vatRepo.save([
      this.vatRepo.create({
        dyeHouseId: houseA.id,
        vatCode: 'V-A01',
        capacityKg: 500,
        status: 'busy',
      }),
      this.vatRepo.create({
        dyeHouseId: houseA.id,
        vatCode: 'V-A02',
        capacityKg: 800,
        status: 'ready',
      }),
      this.vatRepo.create({
        dyeHouseId: houseA.id,
        vatCode: 'V-A03',
        capacityKg: 600,
        status: 'maintenance',
      }),
      this.vatRepo.create({
        dyeHouseId: houseB.id,
        vatCode: 'V-B01',
        capacityKg: 450,
        status: 'busy',
      }),
      this.vatRepo.create({
        dyeHouseId: houseB.id,
        vatCode: 'V-B02',
        capacityKg: 700,
        status: 'ready',
      }),
    ]);

    const now = new Date();
    const daysAgo = (n: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() - n);
      return d;
    };

    const lots = await this.lotRepo.save([
      this.lotRepo.create({
        vatId: vats[0].id,
        lotCode: 'LOT-250901',
        fabricType: '纯棉斜纹',
        colorName: '靛青',
        startAt: daysAgo(1),
        status: 'running',
      }),
      this.lotRepo.create({
        vatId: vats[1].id,
        lotCode: 'LOT-250902',
        fabricType: '涤棉混纺',
        colorName: '藏青',
        startAt: daysAgo(2),
        status: 'rinsing',
      }),
      this.lotRepo.create({
        vatId: vats[3].id,
        lotCode: 'LOT-250903',
        fabricType: '亚麻平纹',
        colorName: '绛红',
        startAt: daysAgo(0),
        status: 'running',
      }),
      this.lotRepo.create({
        vatId: vats[4].id,
        lotCode: 'LOT-250880',
        fabricType: '纯棉帆布',
        colorName: '铁锈红',
        startAt: daysAgo(5),
        status: 'done',
      }),
      this.lotRepo.create({
        vatId: vats[0].id,
        lotCode: 'LOT-250870',
        fabricType: '天丝斜纹',
        colorName: '墨蓝',
        startAt: daysAgo(8),
        status: 'rework',
      }),
      this.lotRepo.create({
        vatId: vats[1].id,
        lotCode: 'LOT-250910',
        fabricType: '针织棉',
        colorName: '雾蓝',
        startAt: daysAgo(0),
        status: 'queued',
      }),
    ]);

    await this.testRepo.save([
      this.testRepo.create({
        dyeLotId: lots[3].id,
        testedAt: daysAgo(4),
        washRating: 4,
        rubRating: 4,
        lightRating: 3,
        pass: true,
        notes: '水洗与摩擦达标',
      }),
      this.testRepo.create({
        dyeLotId: lots[4].id,
        testedAt: daysAgo(6),
        washRating: 2,
        rubRating: 3,
        lightRating: 2,
        pass: false,
        notes: '耐洗与耐光偏低，建议返工',
      }),
      this.testRepo.create({
        dyeLotId: lots[1].id,
        testedAt: daysAgo(1),
        washRating: 4,
        rubRating: 5,
        lightRating: 4,
        pass: true,
        notes: '漂洗段抽检合格',
      }),
      this.testRepo.create({
        dyeLotId: lots[0].id,
        testedAt: daysAgo(0),
        washRating: 3,
        rubRating: 3,
        lightRating: 3,
        pass: true,
        notes: '中期抽检边缘合格',
      }),
      this.testRepo.create({
        dyeLotId: lots[2].id,
        testedAt: daysAgo(0),
        washRating: 2,
        rubRating: 2,
        lightRating: 3,
        pass: false,
        notes: '摩擦牢度不足',
      }),
    ]);

    this.logger.log('Seed completed: admin/dyer + sample dye data');
  }
}
