import { IsInt, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Station } from './station.entity';

@Entity()
export class Connector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsInt()
  @IsNotEmpty()
  connectorId: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  type: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  status: string;

  @Column({ type: 'float', nullable: true })
  power: number;

  @Column({ type: 'float', nullable: true })
  voltage: number;

  @Column({ type: 'float', nullable: true })
  current: number;

  @Column({ type: 'float', nullable: true })
  temperature: number;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  errorCode: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  info: string;

  @ManyToOne(() => Station, station => station.connectors)
  station: Station;
} 