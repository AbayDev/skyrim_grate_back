import { Module } from '@nestjs/common';
import { LogRepository } from './infrastructure/repository/log.reposity';
import { LogService } from './application/service/log.service';

@Module({
  providers: [LogRepository, LogService],
  exports: [LogService],
})
export class LogsModule {}
