import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ProviderLog } from './provider-log';

@Entity()
export class VehicleValuation {
  @PrimaryColumn({ length: 7 })
  vrm: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  lowestValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  highestValue: number;

  @Column()
  provider: string;

  @OneToMany(() => ProviderLog, (log) => log.valuation)
  logs: ProviderLog[];

  get midpointValue(): number {
    return (this.highestValue + this.lowestValue) / 2;
  }
}
