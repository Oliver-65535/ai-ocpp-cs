import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OcppModule } from './ocpp/ocpp.module';
import { User } from './users/entities/user.entity';
import { Station } from './stations/entities/station.entity';
import { Transaction } from './transactions/entities/transaction.entity';
import { StationsModule } from './stations/stations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'ocpp.db',
      entities: [User, Station, Transaction],
      synchronize: true, // Set to false in production
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/dashboard',
      serveStaticOptions: {
        index: false,
      },
    }),
    AuthModule,
    OcppModule,
    StationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
