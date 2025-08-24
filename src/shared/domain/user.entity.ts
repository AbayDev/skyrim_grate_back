import { BaseEntity } from 'src/shared/domain/base.entity';

type UserProps = {
  id: string;
  nickname: string;
  passwordHash: string;
  createdAt?: string;
  updatedAt?: string;
};

export class User extends BaseEntity<UserProps> {}
