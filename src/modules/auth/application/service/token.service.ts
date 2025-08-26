import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  JWT_ACCESS_SERVICE_NAME,
  JWT_REFRESH_SERVICE_NAME,
} from '../../auth.constants';

@Injectable()
export class TokenService {
  constructor(
    @Inject(JWT_ACCESS_SERVICE_NAME)
    private readonly jwtAccessService: JwtService,
    @Inject(JWT_REFRESH_SERVICE_NAME)
    private readonly jwtRefreshService: JwtService,
  ) {}

  public generateAccessToken(userUuid: string) {
    return this.jwtAccessService.sign({ userUuid });
  }

  public generateRefreshToken(userUuid: string) {
    return this.jwtRefreshService.sign({ userUuid });
  }
}
