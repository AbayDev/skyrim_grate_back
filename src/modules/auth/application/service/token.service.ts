import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  JWT_ACCESS_SERVICE_NAME,
  JWT_REFRESH_SERVICE_NAME,
} from '../../auth.constants';

type JwtPayload = {
  userId: string;
};

@Injectable()
export class TokenService {
  constructor(
    @Inject(JWT_ACCESS_SERVICE_NAME)
    private readonly jwtAccessService: JwtService,
    @Inject(JWT_REFRESH_SERVICE_NAME)
    private readonly jwtRefreshService: JwtService,
  ) {}

  public generateAccessToken(userId: string) {
    return this.jwtAccessService.sign({ userId });
  }

  public generateRefreshToken(userId: string) {
    return this.jwtRefreshService.sign({ userId });
  }

  public verifyAccessToken(token: string) {
    return this.jwtAccessService.verify<JwtPayload>(token);
  }

  public verifyRefreshToken(token: string) {
    return this.jwtRefreshService.verify<JwtPayload>(token);
  }
}
