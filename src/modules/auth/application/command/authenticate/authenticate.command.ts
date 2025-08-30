import { Command } from '@nestjs/cqrs';
import { AuthTokenResponse } from 'src/modules/auth/domain/types/auth-token-response';

export class AuthenticateCommand extends Command<AuthTokenResponse> {
  constructor(
    public readonly nickname: string,
    public readonly password: string,
    public readonly meta: {
      ip?: string;
      userAgent?: string;
    },
  ) {
    super();
  }
}
