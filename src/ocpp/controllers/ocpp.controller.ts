import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { OcppService } from '../services/ocpp.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RemoteStartTransactionDto, RemoteStopTransactionDto, ResetStationDto } from '../dto/ocpp-actions.dto';
import { SetChargingProfileRequest, SetChargingProfileResponse } from '../services/ocpp.service';
import { GetCompositeScheduleRequest, GetCompositeScheduleResponse } from '../services/ocpp.service';

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
    return this.ocppService.sendReset(dto.chargePointId, dto.type);
  }

  @Post('set-charging-profile')
  @Roles('admin')
  @ApiOperation({ summary: 'Set charging profile for a charging station' })
  @ApiResponse({ 
    status: 200, 
    description: 'Charging profile set successfully',
    schema: {
      properties: {
        status: { type: 'string', example: 'Accepted' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async setChargingProfile(@Body() request: SetChargingProfileRequest): Promise<SetChargingProfileResponse> {
    return this.ocppService.sendSetChargingProfile(
      request.chargePointId,
      request
    );
  }

  @Post('get-composite-schedule')
  @Roles('admin')
  @ApiOperation({ summary: 'Get composite schedule for a charging station' })
  @ApiResponse({ 
    status: 200, 
    description: 'Composite schedule retrieved successfully',
    schema: {
      properties: {
        status: { type: 'string', example: 'Accepted' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  async getCompositeSchedule(@Body() request: GetCompositeScheduleRequest): Promise<GetCompositeScheduleResponse> {
    return this.ocppService.getCompositeSchedule(
      request.chargePointId,
      request
    );
  }
} 