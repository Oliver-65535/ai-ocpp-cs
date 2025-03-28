import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({
    description: 'Transaction ID',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'OCPP Transaction ID',
    example: 123456
  })
  transactionId: number;

  @ApiProperty({
    description: 'Connector ID',
    example: 1
  })
  connectorId: number;

  @ApiProperty({
    description: 'Transaction status',
    example: 'Started',
    enum: ['Started', 'Stopped']
  })
  status: string;

  @ApiProperty({
    description: 'Meter start value',
    example: 0
  })
  meterStart: number;

  @ApiProperty({
    description: 'Meter stop value',
    example: 100,
    required: false
  })
  meterStop?: number;

  @ApiProperty({
    description: 'Transaction start time',
    example: '2024-03-22T21:48:21.000Z'
  })
  startTime: Date;

  @ApiProperty({
    description: 'Transaction stop time',
    example: '2024-03-22T22:48:21.000Z',
    required: false
  })
  stopTime?: Date;

  @ApiProperty({
    description: 'Associated station ID',
    example: 1
  })
  stationId: number;
} 