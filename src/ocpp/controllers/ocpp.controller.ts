import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { OcppService } from '../services/ocpp.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RemoteStartTransactionDto, RemoteStopTransactionDto, ResetStationDto } from '../dto/ocpp-actions.dto';
import { ResetType, ChangeAvailabilityType } from '../dto/ocpp.dto';

@ApiTags('OCPP')
@Controller('ocpp')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OcppController {
  constructor(private readonly ocppService: OcppService) {}

  @Post('remote-start-transaction')
  @Roles('admin')
  @ApiOperation({ summary: 'Send remote start transaction command to a charging station' })
  @ApiResponse({ 
    status: 200, 
    description: 'Remote start transaction command sent successfully',
    schema: {
      properties: {
        status: { type: 'string', example: 'Accepted' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async remoteStartTransaction(@Body() dto: RemoteStartTransactionDto) {
    return this.ocppService.sendRemoteStartTransaction(
      dto.chargePointId,
      dto.connectorId,
      dto.idTag
    );
  }

  @Post('remote-stop-transaction')
  @Roles('admin')
  @ApiOperation({ summary: 'Send remote stop transaction command to a charging station' })
  @ApiResponse({ 
    status: 200, 
    description: 'Remote stop transaction command sent successfully',
    schema: {
      properties: {
        status: { type: 'string', example: 'Accepted' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async remoteStopTransaction(@Body() dto: RemoteStopTransactionDto) {
    return this.ocppService.sendRemoteStopTransaction(
      dto.chargePointId,
      dto.transactionId,
    );
  }

  @Post('reset')
  @Roles('admin')
  @ApiOperation({ summary: 'Send reset command to a charging station' })
  @ApiResponse({ 
    status: 200, 
    description: 'Reset command sent successfully',
    schema: {
      properties: {
        status: { type: 'string', example: 'Accepted' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async reset(@Body() dto: ResetStationDto) {
    return this.ocppService.sendReset(dto.chargePointId, dto.type as ResetType);
  }

  @Post('unlock-connector')
  @Roles('admin')
  @ApiOperation({ summary: 'Send unlock connector command to a charging station' })
  @ApiResponse({ 
    status: 200, 
    description: 'Unlock connector command sent successfully',
    schema: {
      properties: {
        status: { type: 'string', example: 'Accepted' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async unlockConnector(@Body() dto: { chargePointId: string, connectorId: number }) {
    return this.ocppService.sendUnlockConnector(dto.chargePointId, dto.connectorId);
  }

  @Post('change-availability')
  @Roles('admin')
  @ApiOperation({ summary: 'Send change availability command to a charging station' })
  @ApiResponse({ 
    status: 200, 
    description: 'Change availability command sent successfully',
    schema: {
      properties: {
        status: { type: 'string', example: 'Accepted' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async changeAvailability(@Body() dto: { 
    chargePointId: string, 
    connectorId: number, 
    type: ChangeAvailabilityType 
  }) {
    return this.ocppService.sendChangeAvailability(dto.chargePointId, dto.connectorId, dto.type);
  }

  @Post('get-configuration')
  @Roles('admin')
  @ApiOperation({ summary: 'Get configuration from a charging station' })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuration retrieved successfully',
    schema: {
      properties: {
        configuration: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async getConfiguration(@Body() dto: { chargePointId: string, keys?: string[] }) {
    return this.ocppService.sendGetConfiguration(dto.chargePointId, dto.keys);
  }

  @Post('change-configuration')
  @Roles('admin')
  @ApiOperation({ summary: 'Change configuration on a charging station' })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuration changed successfully',
    schema: {
      properties: {
        status: { type: 'string', example: 'Accepted' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async changeConfiguration(@Body() dto: { 
    chargePointId: string, 
    key: string, 
    value: string 
  }) {
    return this.ocppService.sendChangeConfiguration(dto.chargePointId, dto.key, dto.value);
  }

  @Post('clear-cache')
  @Roles('admin')
  @ApiOperation({ summary: 'Clear cache on a charging station' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cache cleared successfully',
    schema: {
      properties: {
        status: { type: 'string', example: 'Accepted' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async clearCache(@Body() dto: { chargePointId: string }) {
    return this.ocppService.sendClearCache(dto.chargePointId);
  }

  @Post('get-diagnostics')
  @Roles('admin')
  @ApiOperation({ summary: 'Get diagnostics from a charging station' })
  @ApiResponse({ 
    status: 200, 
    description: 'Diagnostics retrieved successfully',
    schema: {
      properties: {
        diagnostics: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async getDiagnostics(@Body() dto: { 
    chargePointId: string, 
    location: string, 
    retries?: number, 
    retryInterval?: number 
  }) {
    return this.ocppService.sendGetDiagnostics(dto.chargePointId, dto.location, dto.retries, dto.retryInterval);
  }

  @Post('update-firmware')
  @Roles('admin')
  @ApiOperation({ summary: 'Update firmware on a charging station' })
  @ApiResponse({ 
    status: 200, 
    description: 'Firmware update initiated successfully',
    schema: {
      properties: {
        status: { type: 'string', example: 'Accepted' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async updateFirmware(@Body() dto: { 
    chargePointId: string, 
    location: string, 
    retrieveDate: string, 
    retries?: number, 
    retryInterval?: number 
  }) {
    return this.ocppService.sendUpdateFirmware(
      dto.chargePointId, 
      dto.location, 
      dto.retrieveDate, 
      dto.retries, 
      dto.retryInterval
    );
  }
} 