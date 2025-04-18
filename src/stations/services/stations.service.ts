import { Injectable } from '@nestjs/common';
import { StationDto } from '../dto/station.dto';

@Injectable()
export class StationsService {
  private stations: Map<string, StationDto> = new Map();

  async findAll(): Promise<StationDto[]> {
    return Array.from(this.stations.values());
  }

  async findOne(chargePointId: string): Promise<StationDto | undefined> {
    return this.stations.get(chargePointId);
  }

  async create(station: StationDto): Promise<StationDto> {
    this.stations.set(station.chargePointId, station);
    return station;
  }

  async update(chargePointId: string, station: StationDto): Promise<StationDto> {
    this.stations.set(chargePointId, station);
    return station;
  }

  async delete(chargePointId: string): Promise<void> {
    this.stations.delete(chargePointId);
  }
} 