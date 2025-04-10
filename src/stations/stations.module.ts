import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsController } from './controllers/stations.controller';
import { StationsService } from './services/stations.service';
import { Station } from './entities/station.entity';
import { Connector } from './entities/connector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Station, Connector])],
  controllers: [StationsController],
  providers: [StationsService],
  exports: [StationsService]
})
export class StationsModule {} 