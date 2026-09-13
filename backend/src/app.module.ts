import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DyeHouseModule } from './dye-house/dye-house.module';
import { VatModule } from './vat/vat.module';
import { DyeLotModule } from './dye-lot/dye-lot.module';
import { FastnessTestModule } from './fastness-test/fastness-test.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SeedService } from './seed.service';
import { User } from './users/user.entity';
import { DyeHouse } from './dye-house/dye-house.entity';
import { Vat } from './vat/vat.entity';
import { DyeLot } from './dye-lot/dye-lot.entity';
import { FastnessTest } from './fastness-test/fastness-test.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3309),
      username: process.env.DB_USER || 'loomlot',
      password: process.env.DB_PASSWORD || 'loomlot123',
      database: process.env.DB_NAME || 'loomlot',
      entities: [User, DyeHouse, Vat, DyeLot, FastnessTest],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, DyeHouse, Vat, DyeLot, FastnessTest]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'loomlot-jwt-secret-change-me',
      signOptions: { expiresIn: '7d' },
    }),
    AuthModule,
    UsersModule,
    DyeHouseModule,
    VatModule,
    DyeLotModule,
    FastnessTestModule,
    DashboardModule,
  ],
  providers: [SeedService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    if (process.env.SEED_ON_START !== 'false') {
      await this.seedService.run();
    }
  }
}
