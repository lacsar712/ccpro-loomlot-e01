/**
 * 独立 seed 入口：npm run seed
 * 也可依赖应用启动时的 SeedService（SEED_ON_START 默认开启）
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed.service';

async function main() {
  process.env.SEED_ON_START = 'false';
  const app = await NestFactory.createApplicationContext(AppModule);
  const seed = app.get(SeedService);
  await seed.run();
  await app.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
