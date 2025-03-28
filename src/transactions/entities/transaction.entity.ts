import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Station } from '../../stations/entities/station.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionId: number;

  @Column()
  connectorId: number;

  @Column()
  status: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  startTime: Date;

  @Column({ type: 'datetime', nullable: true })
  stopTime: Date;

  @Column({ type: 'float', nullable: true })
  meterStart: number;

  @Column({ type: 'float', nullable: true })
  meterStop: number;

  @ManyToOne(() => Station, station => station.transactions)
  station: Station;
} 