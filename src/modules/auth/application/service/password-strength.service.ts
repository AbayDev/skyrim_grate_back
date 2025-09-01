import { BadRequestException, Injectable } from '@nestjs/common';
import { pwnedPassword } from 'hibp';

@Injectable()
export class PasswordStrengthService {
  public async validate(password: string) {
    const count = await pwnedPassword(password);
    if (count) {
      throw new BadRequestException(
        'Пароль найден в базе скомпрометированных. Выберите другой.',
      );
    }
  }
}
