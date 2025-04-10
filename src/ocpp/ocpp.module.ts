import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcppService } from './services/ocpp.service';
import { OcppController } from './controllers/ocpp.controller';
import { Station } from '../stations/entities/station.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Connector } from '../stations/entities/connector.entity';
import { StationsModule } from '../stations/stations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Station, Transaction, Connector]),
    StationsModule
  ],
  controllers: [OcppController],
  providers: [OcppService],
  exports: [OcppService],
})
export class OcppModule {} 