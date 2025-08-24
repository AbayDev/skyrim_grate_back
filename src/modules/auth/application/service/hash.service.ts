import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  static AUTH_HASH_PASSWORD_SALT = 10;
  static HASH_TOKEN_SALT = 10;

  public hashToken(token: string) {
    return bcrypt.hash(token, HashService.HASH_TOKEN_SALT);
  }

  public hashPassword(password: string) {
    return bcrypt.hash(password, HashService.AUTH_HASH_PASSWORD_SALT);
  }

  public comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
