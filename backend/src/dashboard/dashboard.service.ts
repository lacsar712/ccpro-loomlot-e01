import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Vat } from '../vat/vat.entity';
import { DyeLot } from '../dye-lot/dye-lot.entity';
import { FastnessTest } from '../fastness-test/fastness-test.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Vat)
    private readonly vatRepo: Repository<Vat>,
    @InjectRepository(DyeLot)
    private readonly lotRepo: Repository<DyeLot>,
    @InjectRepository(FastnessTest)
    private readonly testRepo: Repository<FastnessTest>,
  ) {}

  async summary() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [vatCount, runningLots, recentTests, failCount] = await Promise.all([
      this.vatRepo.count(),
      this.lotRepo.count({ where: { status: 'running' } }),
      this.testRepo.count({
        where: { testedAt: MoreThanOrEqual(sevenDaysAgo) },
      }),
      this.testRepo.count({ where: { pass: false } }),
    ]);

    return {
      vatCount,
      runningLots,
      recentTests7d: recentTests,
      failCount,
    };
  }
}
