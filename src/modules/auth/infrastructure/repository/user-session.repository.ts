import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserSessionEntity } from '../database/user-session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSessionCreate } from '../../domain/types/user-session-create';

@Injectable()
export class UserSessionRepository {
  constructor(
    @InjectRepository(UserSessionEntity)
    private readonly repo: Repository<UserSessionEntity>,
  ) {}

  public async deleteByRefreshToken(refreshTokenHash: string) {
    await this.repo.delete({
      refreshTokenHash,
    });
  }

  public create(session: UserSessionCreate) {
    const newSession = new UserSessionEntity();
    newSession.userId = session.userId;
    newSession.ip = session.ip;
    newSession.userAgent = session.userAgent;
    newSession.refreshTokenHash = session.refreshTokenHash;
    newSession.lastActivity = session.lastActivity;
    return this.repo.save(newSession);
  }

  public async removeByToken(tokenHash: string) {
    const session = await this.repo.findOneBy({
      refreshTokenHash: tokenHash,
    });

    if (!session) {
      throw new NotFoundException('Сессия не найдена');
    }

    return this.repo.remove(session);
  }
}
