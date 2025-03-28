import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity()
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  chargePointId: string;

  @Column()
  status: string;

  @Column({ type: 'json', nullable: true })
  connectors: {
    id: number;
    status: string;
    errorCode: string;
    info: string;
  }[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  lastSeen: Date;

  @OneToMany(() => Transaction, transaction => transaction.station)
  transactions: Transaction[];
} 