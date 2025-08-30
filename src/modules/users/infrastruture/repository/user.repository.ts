import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/user.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

export type UserFindOneOptions = FindOneOptions<UserEntity>;
export type UserFindByOptions = FindOptionsWhere<UserEntity>;

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  public findByNickname(nickname: string, options?: UserFindOneOptions) {
    return this.repo.findOne({
      where: {
        nickname,
      },
      ...options,
    });
  }

  public findOneBy(options: UserFindByOptions) {
    return this.repo.findOneBy(options);
  }

  public create(nickname: string, password: string) {
    const user = new UserEntity();
    user.nickname = nickname;
    user.passwordHash = password;
    return this.repo.save(user);
  }
}
