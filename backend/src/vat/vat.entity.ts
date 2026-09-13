import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { DyeHouse } from '../dye-house/dye-house.entity';
import { DyeLot } from '../dye-lot/dye-lot.entity';

export type VatStatus = 'ready' | 'busy' | 'maintenance';

@Entity('vats')
@Unique(['dyeHouseId', 'vatCode'])
export class Vat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  dyeHouseId: number;

  @ManyToOne(() => DyeHouse, (dh) => dh.vats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dyeHouseId' })
  dyeHouse: DyeHouse;

  @Column({ type: 'varchar', length: 64 })
  vatCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  capacityKg: number;

  @Column({ type: 'varchar', length: 32, default: 'ready' })
  status: VatStatus;

  @OneToMany(() => DyeLot, (lot) => lot.vat)
  dyeLots: DyeLot[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
