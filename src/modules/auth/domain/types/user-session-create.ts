import { UserSession } from '../entities/user-session.entity';

export type UserSessionCreate = Omit<
  UserSession['props'],
  'createdAt' | 'id'
> & {
  refreshToken: string;
};
