import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from 'http';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '../../stations/entities/station.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { RPCServer, createRPCError } from 'ocpp-rpc';
import { randomUUID } from 'crypto';
import * as OCPPDTO from '../dto/ocpp.dto';
import { StationsService } from '../../stations/services/stations.service';

@Injectable()
export class OcppService implements OnModuleInit {
  private server: Server;
  private rpcServer: RPCServer;
  private clients: Map<string, any> = new Map();

  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
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
      client.handle('BootNotification', async (params: OCPPDTO.BootNotificationRequest) => {
        console.log(`Server got BootNotification from ${client.identity}:`, params);
        chargePointId = client.identity;
        console.log('chargePointId', chargePointId);
        this.clients.set(chargePointId, client);

        const response = await this.handleBootNotification(chargePointId, params);
        return response;
      });

      // Handle StatusNotification
      client.handle('StatusNotification', async (params: OCPPDTO.StatusNotificationRequest) => {
        console.log(`Server got StatusNotification from ${client.identity}:`, params);
        const station = await this.stationRepository.findOne({ where: { chargePointId } });
        // if (station) {
        //   const connectorIndex = station.connectors.findIndex(c => c.id === params.connectorId);
        //   // if (connectorIndex >= 0) {
          //   station.connectors[connectorIndex] = {
          //     id: params.connectorId,
          //     status: params.status,
          //     // errorCode: params.errorCode,
          //     // info: params.info || '',
          //   };
          // } else {
          //   station.connectors.push({
          //     id: params.connectorId,
          //     status: params.status,
          //     // errorCode: params.errorCode,
          //     // info: params.info || '',
          //   });
          // }
          // await this.stationRepository.save(station);
        // }
        return {} as OCPPDTO.StatusNotificationResponse;
      });

      // Handle StartTransaction
      client.handle('StartTransaction', async (params: OCPPDTO.StartTransactionRequest) => {
        console.log(`Server got StartTransaction from ${client.identity}:`, params);
        const station = await this.stationRepository.findOne({ where: { chargePointId } });
        if (station) {
          const transaction = this.transactionRepository.create({
            connectorId: params.connectorId,
            status: 'Started',
            meterStart: params.meterStart,
            station,
          });
          const savedTransaction = await this.transactionRepository.save(transaction);
          const response: OCPPDTO.StartTransactionResponse = {
            idTagInfo: {
              status: OCPPDTO.AuthorizationStatus.Accepted
            },
            transactionId: savedTransaction.id
          };
          return response;
        }
        throw new Error('Station not found');
      });

      // Handle StopTransaction
      client.handle('StopTransaction', async (params: OCPPDTO.StopTransactionRequest) => {
        console.log(`Server got StopTransaction from ${client.identity}:`, params);
        const transaction = await this.transactionRepository.findOne({
          where: { id: params.transactionId },
        });
        if (transaction) {
          transaction.status = 'Stopped';
          transaction.stopTime = new Date();
          transaction.meterStop = params.meterStop;
          await this.transactionRepository.save(transaction);
        }
        const response: OCPPDTO.StopTransactionResponse = {
          idTagInfo: {
            status: OCPPDTO.AuthorizationStatus.Accepted
          }
        };
        return response;
      });

      // Handle Heartbeat
      client.handle('Heartbeat', () => {
        console.log(`Server got Heartbeat from ${client.identity}`);
        const response: OCPPDTO.HeartbeatResponse = {
          currentTime: new Date().toISOString()
        };
        return response;
      });

      // Handle Authorize
      client.handle('Authorize', async (params: OCPPDTO.AuthorizeRequest) => {
        console.log(`Server got Authorize from ${client.identity}:`, params);
        const response: OCPPDTO.AuthorizeResponse = {
          idTagInfo: {
            status: OCPPDTO.AuthorizationStatus.Accepted
          }
        };
        return response;
      });

      // Handle MeterValues
      client.handle('MeterValues', async (params: OCPPDTO.MeterValuesRequest) => {
        console.log(`Server got MeterValues from ${client.identity}:`, params);
        return {} as OCPPDTO.MeterValuesResponse;
      });

      // Handle DataTransfer
      client.handle('DataTransfer', async (params: OCPPDTO.DataTransferRequest) => {
        console.log(`Server got DataTransfer from ${client.identity}:`, params);
        const response: OCPPDTO.DataTransferResponse = {
          status: OCPPDTO.DataTransferStatus.Accepted
        };
        return response;
      });

      // Handle DiagnosticsStatusNotification
      client.handle('DiagnosticsStatusNotification', async (params: OCPPDTO.DiagnosticsStatusNotificationRequest) => {
        console.log(`Server got DiagnosticsStatusNotification from ${client.identity}:`, params);
        return {} as OCPPDTO.DiagnosticsStatusNotificationResponse;
      });

      // Handle FirmwareStatusNotification
      client.handle('FirmwareStatusNotification', async (params: OCPPDTO.FirmwareStatusNotificationRequest) => {
        console.log(`Server got FirmwareStatusNotification from ${client.identity}:`, params);
        return {} as OCPPDTO.FirmwareStatusNotificationResponse;
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

  private async sendRequest<T>(chargePointId: string, method: string, request: T) {
    const client = this.clients.get(chargePointId);
    if (!client) {
      throw new Error('Client not found');
    }
    return await client.call(method, request);
  }

  async sendRemoteStartTransaction(chargePointId: string, connectorId: number, idTag: string) {
    return this.sendRequest(chargePointId, 'RemoteStartTransaction', {
      connectorId,
      idTag
    } as OCPPDTO.RemoteStartTransactionRequest);
  }

  async sendRemoteStopTransaction(chargePointId: string, transactionId: number) {
    return this.sendRequest(chargePointId, 'RemoteStopTransaction', {
      transactionId
    } as OCPPDTO.RemoteStopTransactionRequest);
  }

  async sendReset(chargePointId: string, type: OCPPDTO.ResetType) {
    return this.sendRequest(chargePointId, 'Reset', {
      type
    } as OCPPDTO.ResetRequest);
  }

  async sendUnlockConnector(chargePointId: string, connectorId: number) {
    return this.sendRequest(chargePointId, 'UnlockConnector', {
      connectorId
    } as OCPPDTO.UnlockConnectorRequest);
  }

  async sendChangeAvailability(chargePointId: string, connectorId: number, type: OCPPDTO.ChangeAvailabilityType) {
    return this.sendRequest(chargePointId, 'ChangeAvailability', {
      connectorId,
      type
    } as OCPPDTO.ChangeAvailabilityRequest);
  }

  async sendGetConfiguration(chargePointId: string, keys?: string[]) {
    return this.sendRequest(chargePointId, 'GetConfiguration', {
      key: keys
    } as OCPPDTO.GetConfigurationRequest);
  }

  async sendChangeConfiguration(chargePointId: string, key: string, value: string) {
    return this.sendRequest(chargePointId, 'ChangeConfiguration', {
      key,
      value
    } as OCPPDTO.ChangeConfigurationRequest);
  }

  async sendClearCache(chargePointId: string) {
    return this.sendRequest(chargePointId, 'ClearCache', {} as OCPPDTO.ClearCacheRequest);
  }

  async sendGetDiagnostics(chargePointId: string, location: string, retries?: number, retryInterval?: number) {
    return this.sendRequest(chargePointId, 'GetDiagnostics', {
      location,
      retries,
      retryInterval
    } as OCPPDTO.GetDiagnosticsRequest);
  }

  async sendUpdateFirmware(chargePointId: string, location: string, retrieveDate: string, retries?: number, retryInterval?: number) {
    return this.sendRequest(chargePointId, 'UpdateFirmware', {
      location,
      retrieveDate,
      retries,
      retryInterval
    } as OCPPDTO.UpdateFirmwareRequest);
  }

  async handleBootNotification(clientId: string, request: OCPPDTO.BootNotificationRequest): Promise<OCPPDTO.BootNotificationResponse> {
    const station = await this.stationsService.findOneByChargePointId(clientId);
    if (!station) {
      await this.stationsService.create({
        chargePointId: clientId,
        status: 'available',
        connectors: [],
        vendor: request.chargePointVendor,
        model: request.chargePointModel,
        // serialNumber: request.chargePointSerialNumber,
        firmwareVersion: request.firmwareVersion
      });
    } else {
      await this.stationsService.update(station.id, {
        vendor: request.chargePointVendor,
        model: request.chargePointModel,
        // serialNumber: request.chargePointSerialNumber,
        firmwareVersion: request.firmwareVersion,
        // lastSeen: new Date()
      });
    }

    return {
      status: OCPPDTO.BootNotificationStatus.Accepted,
      currentTime: new Date().toISOString(),
      interval: 60
    };
  }
} 