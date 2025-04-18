import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcppService } from './services/ocpp.service';
import { OcppController } from './controllers/ocpp.controller';
import { Station } from '../stations/entities/station.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { StationsModule } from 'src/stations/stations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Station, Transaction]),
    StationsModule,
  ],
  controllers: [OcppController],
  providers: [OcppService],
  exports: [OcppService],
})
export class OcppModule {} 