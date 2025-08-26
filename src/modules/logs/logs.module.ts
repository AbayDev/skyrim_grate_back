import { Global, Module } from '@nestjs/common';
import { LogRepository } from './infrastructure/repository/log.reposity';
import { LogService } from './application/service/log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './infrastructure/database/log.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  providers: [LogRepository, LogService],
  exports: [LogService],
})
export class LogsModule {}
