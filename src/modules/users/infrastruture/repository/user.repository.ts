import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  public findByNickname(nickname: string) {
    return this.repo.findOneBy({
      nickname,
    });
  }

  public create(nickname: string, password: string) {
    const user = new UserEntity();
    user.nickname = nickname;
    user.passwordHash = password;
    return this.repo.save(user);
  }
}
