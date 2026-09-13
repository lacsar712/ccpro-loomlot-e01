import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Vat } from '../vat/vat.entity';
import { FastnessTest } from '../fastness-test/fastness-test.entity';

export type DyeLotStatus =
  | 'queued'
  | 'running'
  | 'rinsing'
  | 'done'
  | 'rework';

@Entity('dye_lots')
export class DyeLot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  vatId: number;

  @ManyToOne(() => Vat, (vat) => vat.dyeLots, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vatId' })
  vat: Vat;

  @Column({ type: 'varchar', length: 64 })
  lotCode: string;

  @Column({ type: 'varchar', length: 128 })
  fabricType: string;

  @Column({ type: 'varchar', length: 128 })
  colorName: string;

  @Column({ type: 'datetime' })
  startAt: Date;

  @Column({ type: 'varchar', length: 32, default: 'queued' })
  status: DyeLotStatus;

  @OneToMany(() => FastnessTest, (t) => t.dyeLot)
  fastnessTests: FastnessTest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
