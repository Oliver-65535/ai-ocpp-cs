import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from 'http';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '../../stations/entities/station.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { RPCServer, createRPCError } from 'ocpp-rpc';
import { randomInt, randomUUID } from 'crypto';
import { StationsService } from '../../stations/services/stations.service';

interface OCPPRequest {
  payload: any;
}

interface OCPPResponse {
  status: string;
  [key: string]: any;
}

export interface ChargingSchedulePeriod {
  startPeriod: number;
  limit: number;
  numberPhases?: number;
}

export interface ChargingSchedule {
  duration?: number;
  startSchedule?: string;
  chargingRateUnit: 'A' | 'W';
  chargingSchedulePeriod: ChargingSchedulePeriod[];
  minChargingRate?: number;
}

export interface CsChargingProfiles {
  chargingProfileId: number;
  transactionId?: number;
  stackLevel: number;
  chargingProfilePurpose: 'ChargePointMaxProfile' | 'TxDefaultProfile' | 'TxProfile';
  chargingProfileKind: 'Absolute' | 'Recurring' | 'Relative';
  recurrencyKind?: 'Daily' | 'Weekly';
  validFrom?: string;
  validTo?: string;
  chargingSchedule: ChargingSchedule;
}

export interface SetChargingProfileRequest {
  chargePointId: string;
  connectorId: number;
  csChargingProfiles: CsChargingProfiles;
}

export interface SetChargingProfileResponse {
  status: 'Accepted' | 'Rejected' | 'NotSupported';
}

export interface GetCompositeScheduleRequest {
  chargePointId: string;
  connectorId: number;
  duration: number;
  chargingRateUnit?: 'A' | 'W';
}

export interface GetCompositeScheduleResponse {
  status: 'Accepted' | 'Rejected';
  connectorId?: number;
  scheduleStart?: string;
  chargingSchedule?: ChargingSchedule;
}

@Injectable()
export class OcppService implements OnModuleInit {
  private server: Server;
  private rpcServer: RPCServer;
  private clients: Map<string, any> = new Map();

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private stationsService: StationsService
  ) {}

  onModuleInit() {
    this.server = new Server();
    this.rpcServer = new RPCServer({
      protocols: ['ocpp1.6'],
      strictMode: true,
    });

    this.rpcServer.auth((accept, reject, handshake) => {
      accept({
        sessionId: randomUUID()
      });
    });

    this.server.on('upgrade', this.rpcServer.handleUpgrade);

    this.rpcServer.on('client', async (client) => {
      console.log(`${client.session.sessionId} connected!`);
      let chargePointId: string;

      // Handle BootNotification
      client.handle('BootNotification', async ({params}) => {
        console.log(`Server got BootNotification from ${client.identity}:`, params);
        chargePointId = client.identity;
        console.log('chargePointId', chargePointId);
        this.clients.set(chargePointId, client);

        let station = await this.stationsService.findOne(chargePointId);
        console.log('station', station);
        if (!station) {
          console.log('creating station');
          station = await this.stationsService.create({
              chargePointId,
              status: 'Available',
              connectors: [],
              id: 0,
              lastSeen: new Date()
            });
          console.log('savedStation', station);
        }

        return {
          status: 'Accepted',
          currentTime: new Date().toISOString(),
          interval: 300,
        };
      });

      // Handle StatusNotification
      client.handle('StatusNotification', async ({params}) => {
        console.log(`Server got StatusNotification from ${client.identity}:`, params);
        const station = await this.stationsService.findOne(chargePointId);
        if (station) {
          const connectorIndex = station.connectors.findIndex(c => c.id === params.connectorId);
          if (connectorIndex >= 0) {
            station.connectors[connectorIndex] = {
              id: params.connectorId,
              status: params.status,
              errorCode: params.errorCode,
              info: params.info,
            };
          } else {
            station.connectors.push({
              id: params.connectorId,
              status: params.status,
              errorCode: params.errorCode,
              info: params.info,
            });
          }
          await this.stationsService.update(chargePointId, station);
        }
        return {};
      });

      // Handle Authorize
      client.handle('Authorize', async ({params}) => {
        console.log(`Server got Authorize from ${client.identity}:`, params);
        return { idTagInfo: { status: 'Accepted' } };
      });

      // Handle StartTransaction
      client.handle('StartTransaction', async ({params}) => {
        console.log(`Server got StartTransaction from ${client.identity}:`, params);
        // const station = await this.stationsService.findOne(chargePointId);
        // if (station) {
        //   const transaction = this.transactionRepository.create({
        //     transactionId: params.transactionId,
        //     connectorId: params.connectorId,
        //     status: 'Started',
        //     meterStart: params.meterStart,
        //     station,
        //   });
        //   await this.transactionRepository.save(transaction);
        // }
        return { idTagInfo: { status: 'Accepted' }, transactionId:1};
      });

      // Handle StopTransaction
      client.handle('StopTransaction', async ({params}) => {
        console.log(`Server got StopTransaction from ${client.identity}:`, params);
        const transaction = await this.transactionRepository.findOne({
          where: { transactionId: params.transactionId },
        });
        if (transaction) {
          transaction.status = 'Stopped';
          transaction.stopTime = new Date();
          transaction.meterStop = params.meterStop;
          await this.transactionRepository.save(transaction);
        }
        return { idTagInfo: { status: 'Accepted' } };
      });

      // Handle Heartbeat
      client.handle('Heartbeat', ({params}) => {
        console.log(`Server got Heartbeat from ${client.identity}:`, params);
        return {
          currentTime: new Date().toISOString()
        };
      });

      // Wildcard handler for unhandled methods
      client.handle(({method, params}) => {
        console.log(`Server got ${method} from ${client.identity}:`, params);
        throw createRPCError("NotImplemented");
      });

      client.on('close', () => {
        if (chargePointId) {
          console.log('closing client', chargePointId);
          this.clients.delete(chargePointId);
        }
      });
    });

    this.server.listen(9600, () => {
      console.log('OCPP WebSocket server is running on port 9600');
    });
  }

  async sendRemoteStartTransaction(chargePointId: string, connectorId: number) {
    const client = this.clients.get(chargePointId);
    if (client) {
      return await client.call('RemoteStartTransaction', { connectorId, idTag: '1234567890' });
    }
    throw new Error('Client not found');
  }

  async sendRemoteStopTransaction(chargePointId: string, transactionId: number) {
    const client = this.clients.get(chargePointId);
    if (client) {
      return await client.call('RemoteStopTransaction', { transactionId });
    }
    throw new Error('Client not found');
  }

  async sendReset(chargePointId: string, type: 'Soft' | 'Hard') {
    const client = this.clients.get(chargePointId);
    if (client) {
      return await client.call('Reset', { type });
    }
    throw new Error('Client not found');
  }

  async sendSetChargingProfile(chargePointId: string, request: SetChargingProfileRequest): Promise<SetChargingProfileResponse> {
    const client = this.clients.get(chargePointId);
    if (client) {
      const { chargePointId: _, ...ocppRequest } = request;
      return await client.call('SetChargingProfile', ocppRequest);
    }
    throw new Error('Client not found');
  }

  async getCompositeSchedule(chargePointId: string, request: GetCompositeScheduleRequest): Promise<GetCompositeScheduleResponse> {
    const client = this.clients.get(chargePointId);
    if (client) {
      const { chargePointId: _, ...ocppRequest } = request;
      return await client.call('GetCompositeSchedule', ocppRequest);
    }
    throw new Error('Client not found');
  }
}