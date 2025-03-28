import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '../entities/station.entity';
import { StationDto } from '../dto/station.dto';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
  ) {}

  async findAll(): Promise<StationDto[]> {
    const stations = await this.stationRepository.find();
    return stations.map(station => ({
      id: station.id,
      chargePointId: station.chargePointId,
      status: station.status,
      lastSeen: station.lastSeen,
      connectors: station.connectors.map(connector => ({
        id: connector.id,
        status: connector.status,
        errorCode: connector.errorCode,
        info: connector.info
      }))
    }));
  }
} 