import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Connector } from './connector.entity';
import { Type } from 'class-transformer';

@Entity()
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  chargePointId: string;

  @Column()
  status: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  lastSeen: Date;

  // @Column({ nullable: true, default: null })
  // vendor: string | null;

  // @Column({ nullable: true, default: null })
  // model: string | null;

  // @Column({ nullable: true, default: null })
  // serialNumber: string | null;

  // @Column({ nullable: true, default: null })
  // firmwareVersion: string | null;

  @OneToMany(() => Transaction, transaction => transaction.station)
  transactions: Transaction[];

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  location: string;

  @Column({ nullable: true })
  @IsString()
  description: string;

  @OneToMany(() => Connector, connector => connector.station, { cascade: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Connector)
  connectors: Connector[];
} 