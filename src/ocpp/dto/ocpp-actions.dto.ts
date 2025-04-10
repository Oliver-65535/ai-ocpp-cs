import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum } from 'class-validator';

export class RemoteStartTransactionDto {
  @ApiProperty({
    description: 'Charge Point ID',
    example: 'CP001'
  })
  @IsString()
  chargePointId: string;

  @ApiProperty({
    description: 'Connector ID to start transaction on',
    example: 1
  })
  @IsNumber()
  connectorId: number;

  @ApiProperty({
    description: 'ID Tag',
    example: '1234567890'
  })
  @IsString()
  idTag: string;
}

export class RemoteStopTransactionDto {
  @ApiProperty({
    description: 'Charge Point ID',
    example: 'CP001'
  })
  @IsString()
  chargePointId: string;

  @ApiProperty({
    description: 'Transaction ID to stop',
    example: 123456
  })
  @IsNumber()
  transactionId: number;
}

export class ResetStationDto {
  @ApiProperty({
    description: 'Charge Point ID',
    example: 'CP001'
  })
  @IsString()
  chargePointId: string;

  @ApiProperty({
    description: 'Reset type',
    example: 'Soft',
    enum: ['Soft', 'Hard']
  })
  @IsEnum(['Soft', 'Hard'])
  type: 'Soft' | 'Hard';
} 