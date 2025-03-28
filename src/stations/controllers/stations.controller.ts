import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { StationDto } from '../dto/station.dto';
import { StationsService } from '../services/stations.service';

@ApiTags('Stations')
@Controller('stations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token for authentication',
  required: true,
})
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all charging stations',
    description: 'Retrieves a list of all charging stations in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all charging stations',
    type: [StationDto],
    schema: {
      example: [{
        id: 1,
        chargePointId: 'CP001',
        status: 'Available',
        lastSeen: '2024-03-22T21:48:21.000Z',
        connectors: [
          {
            id: 1,
            status: 'Available',
            errorCode: 'NoError',
            info: 'Normal operation'
          }
        ]
      }]
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing authentication token' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Insufficient permissions' 
  })
  async findAll(): Promise<StationDto[]> {
    return this.stationsService.findAll();
  }
} 