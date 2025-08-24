import { BaseEntity } from 'src/shared/domain/base.entity';

type Props = {
  id: number;
  userId: string;
  refreshTokenHash: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  lastActivity?: Date;
};

export class UserSession extends BaseEntity<Props> {}
