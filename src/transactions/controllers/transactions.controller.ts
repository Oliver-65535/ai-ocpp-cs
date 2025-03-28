import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TransactionDto } from '../dto/transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all transactions for a specific station' })
  @ApiQuery({
    name: 'stationId',
    required: true,
    description: 'ID of the station to get transactions for',
    type: String
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of transactions for the specified station',
    type: [TransactionDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findAll(@Query('stationId') stationId: string) {
    return this.transactionRepository.find({
      where: {
        station: { id: parseInt(stationId) },
      },
      relations: ['station'],
    });
  }
} 