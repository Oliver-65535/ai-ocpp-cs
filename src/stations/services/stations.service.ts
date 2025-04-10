import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '../entities/station.entity';
import { StationDto } from '../dto/station.dto';
import { CreateStationDto } from '../dto/create-station.dto';
import { UpdateStationDto } from '../dto/update-station.dto';

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

  async findOneByChargePointId(chargePointId: string): Promise<Station> {
    const station = await this.stationRepository.findOne({ where: { chargePointId } });
    if (!station) {
      throw new NotFoundException(`Station with chargePointId ${chargePointId} not found`);
    }
    return station;
  }

  async create(createStationDto: CreateStationDto): Promise<Station> {
    const station = this.stationRepository.create(createStationDto);
    return this.stationRepository.save(station);
  }

  async update(id: number, updateStationDto: UpdateStationDto): Promise<Station> {
    await this.stationRepository.update(id, updateStationDto);
    const station = await this.stationRepository.findOne({ where: { id } });
    if (!station) {
      throw new NotFoundException(`Station with id ${id} not found`);
    }
    return station;
  }
} 