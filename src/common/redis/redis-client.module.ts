/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { RedisConfig } from 'src/config/redis.config';
import { RateLimitService } from './rate-limit.service';
import { REDIS_CLIENT } from './redis-client.const';
import { LogService } from 'src/modules/logs/application/service/log.service';
import { LogsModule } from 'src/modules/logs/logs.module';
import {
  ErrorLogReason,
  LogActor,
  LogEntity,
} from 'src/modules/logs/domain/types/log-payload';

@Global()
@Module({
  imports: [LogsModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [RedisConfig.KEY, LogService],
      useFactory: async (
        redisConfig: ConfigType<typeof RedisConfig>,
        logService: LogService,
      ): Promise<RedisClientType> => {
        const client: RedisClientType = createClient({ url: redisConfig.url });
        client.on('error', (e: Error) => {
          logService.error({
            context: 'Redis',
            message: 'не удалось подключиться',
            payload: {
              actor: {
                type: LogActor.System,
                id: 'RedisModule',
              },
              entity: {
                type: LogEntity.Redis,
              },
              reason: ErrorLogReason.RedisConnectFailed,
            },
            errorInstance: e,
          });
        });
        await client.connect();
        return client;
      },
    },
    RateLimitService,
  ],
  exports: [REDIS_CLIENT],
})
export class RedisClientModule {}
