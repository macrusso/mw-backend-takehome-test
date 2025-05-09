import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VehicleValuation } from './vehicle-valuation';

@Entity()
export class ProviderLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 7 })
  vrm: string;

  @ManyToOne(() => VehicleValuation, (valuation) => valuation.logs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vrm', referencedColumnName: 'vrm' })
  valuation: VehicleValuation;

  @Column()
  provider: string;

  @Column()
  requestUrl: string;

  @Column()
  responseCode: number;

  @Column({ nullable: true })
  errorMessage?: string;

  @Column()
  durationMs: number;

  @CreateDateColumn()
  createdAt: Date;
}
