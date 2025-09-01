import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RedisConfig } from 'src/config/redis.config';
import { RedisClientType } from 'redis';
import { LogService } from 'src/modules/logs/application/service/log.service';
import {
  ErrorLogReason,
  LogActor,
  LogEntity,
} from 'src/modules/logs/domain/types/log-payload';
import { REDIS_CLIENT } from './redis-client.const';

@Injectable()
export class RateLimitService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClientType<any>, // Add generic type for RedisClientType
    @Inject(RedisConfig.KEY)
    private readonly redisConfig: ConfigType<typeof RedisConfig>,
    private readonly logService: LogService,
  ) {}

  /**
   * Проверка лимита запросов
   * @param key уникальный ключ(идентификатор пользователя или ip)
   */
  async checkLimit(key: string) {
    /**
     * уникальный ключ для текущего окна времени
     */
    const windowKey = `rate:${key}:${Math.floor(Date.now() / 1000 / this.redisConfig.limitWindowSize)}`;
    /**
     * уникальный ключ для превышения лимита
     */
    const exceededKey = `rate-limit-exceeded:${key}`;

    /**
     * Lua-скрипт для Redis:
     * - INCR KEYS[1] увеличивает счетчик запросов для ключа.
     * - если это первый запрос (current == 1), устанавливается TTL (EXPIRE) на окно времени.
     * - если количество запросов превышено (current < tonumber(ARGV[2])) увеличиваем счетчик превышении KEYS[2]
     * - если exceeded == 1, после первого превышения устанавливаем TTL (EXPIRE) на 1 час
     * - возвращем current - счетчик запроса, exceeded - счетчик превышении
     *
     * Использование Lua гарантирует атомарность: инкремент и установка TTL происходит в одной операции, что важно при высокой нагрузке
     */
    const script = `
      -- увеличиваем счетчик запросов
      local current = redis.call('INCR', KEYS[1])
      if current == 1 then
        -- устанавливаем TTL окна
        redis.call('EXPIRE', KEYS[1], ARGV[1])
      end
      
      local exceeded = 0
      if (current > tonumber(ARGV[2])) then
        -- Лимит превышен, устанавливаем счетчик превышении
        exceeded = redis.call('INCR', KEYS[2])

        if (exceeded == 1)
          -- TTL для счетчика превышении 
          redis.call('EXPIRE', KEYS[2], 3600)
        end
      
      end

      return {current,exceeded}
    `;

    try {
      const [count, exceeded] = (await this.redisClient.eval(script, {
        keys: [windowKey, exceededKey],
        arguments: [
          this.redisConfig.limitWindowSize.toString(),
          this.redisConfig.maxRequests.toString(),
        ],
      })) as [number, number];

      return {
        count,
        exceeded,
        isAllowed: count <= this.redisConfig.maxRequests,
      };
    } catch (e) {
      await this.logService.error({
        context: 'Ограничение скрости',
        message: 'не удалось выполнить скрипт Lua для Redis',
        payload: {
          actor: {
            type: LogActor.System,
            id: 'RateLimitService',
          },
          entity: {
            type: LogEntity.Redis,
            details: {
              windowKey,
              exceededKey,
            },
          },
          reason: ErrorLogReason.RedisScriptFailed,
        },
        errorInstance: e,
      });
      throw e;
    }
  }
}
