import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  static AUTH_HASH_PASSWORD_SALT = 10;
  static HASH_TOKEN_SALT = 10;

  static hashToken(token: string) {
    return bcrypt.hash(token, HashService.HASH_TOKEN_SALT);
  }

  static hashPassword(password: string) {
    return bcrypt.hash(password, HashService.AUTH_HASH_PASSWORD_SALT);
  }

  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }

  static compareSync(value: string, hash: string) {
    return bcrypt.compareSync(value, hash);
  }
}
