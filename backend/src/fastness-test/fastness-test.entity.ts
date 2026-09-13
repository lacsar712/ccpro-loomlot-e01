import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DyeLot } from '../dye-lot/dye-lot.entity';

@Entity('fastness_tests')
export class FastnessTest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  dyeLotId: number;

  @ManyToOne(() => DyeLot, (lot) => lot.fastnessTests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dyeLotId' })
  dyeLot: DyeLot;

  @Column({ type: 'datetime' })
  testedAt: Date;

  @Column({ type: 'tinyint' })
  washRating: number;

  @Column({ type: 'tinyint' })
  rubRating: number;

  @Column({ type: 'tinyint' })
  lightRating: number;

  @Column({ type: 'boolean', default: true })
  pass: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
