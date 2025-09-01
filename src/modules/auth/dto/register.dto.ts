import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  nickname: string;

  @IsString()
  @MinLength(15, {
    message: ({ constraints }) =>
      `Пароль должен содержать минимум ${constraints[0]} символов`,
  })
  @MaxLength(128, {
    message: ({ constraints }) =>
      `Пароль не может длиннее ${constraints[0]} символов`,
  })
  password: string;
}
