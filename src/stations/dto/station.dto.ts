import { ApiProperty } from '@nestjs/swagger';

class ConnectorDto {
  @ApiProperty({
    description: 'Unique identifier of the connector',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Current status of the connector',
    enum: ['Available', 'Charging', 'Finishing', 'Reserved', 'Unavailable', 'Faulted'],
    example: 'Available'
  })
  status: string;

  @ApiProperty({
    description: 'Error code from the connector',
    example: 'NoError'
  })
  errorCode: string;

  @ApiProperty({
    description: 'Additional information about the connector status',
    example: 'Normal operation'
  })
  info: string;
}

export class StationDto {
  @ApiProperty({
    description: 'Unique identifier of the station',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'OCPP Charge Point ID of the station',
    example: 'CP001'
  })
  chargePointId: string;

  @ApiProperty({
    description: 'Current status of the station',
    enum: ['Available', 'Charging', 'Finishing', 'Reserved', 'Unavailable', 'Faulted'],
    example: 'Available'
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp of the last communication with the station',
    example: '2024-03-22T21:48:21.000Z'
  })
  lastSeen: Date;

  @ApiProperty({
    description: 'List of connectors in the station',
    type: [ConnectorDto]
  })
  connectors: ConnectorDto[];
} 