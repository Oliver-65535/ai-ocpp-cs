import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Connector } from '../entities/connector.entity';

export class CreateStationDto {
  @IsString()
  chargePointId: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  vendor?: string;

  @IsString()
  @IsOptional()
  firmwareVersion?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsArray()
  @IsOptional()
  connectors?: Connector[];

  @IsNumber()
  @IsOptional()
  lastSeen?: number;
} 