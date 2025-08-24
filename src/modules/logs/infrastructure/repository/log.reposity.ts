import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LogEntity } from '../database/log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LogCreate } from '../../domain/types/log-create';

@Injectable()
export class LogRepository {
  constructor(
    @InjectRepository(LogEntity)
    private readonly rep: Repository<LogEntity>,
  ) {}

  public async create(logInfo: LogCreate) {
    const log = new LogEntity();

    log.message = logInfo.message;
    log.type = logInfo.type;
    log.payload = logInfo.payload;
    log.stack = logInfo.stack;

    return this.rep.save(log);
  }
}
