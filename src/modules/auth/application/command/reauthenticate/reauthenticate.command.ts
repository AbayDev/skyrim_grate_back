import { Command } from '@nestjs/cqrs';
import { AuthTokenResponse } from 'src/modules/auth/domain/types/auth-token-response';

export class ReauthenticateCommand extends Command<AuthTokenResponse> {
  constructor(
    public readonly refreshToken: string,
    public readonly meta: {
      ip?: string;
      userAgent?: string;
    },
  ) {
    super();
  }
}
