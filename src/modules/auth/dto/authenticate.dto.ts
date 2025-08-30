import { IsString } from 'class-validator';

export class AuthenticateDto {
  @IsString()
  nickname: string;

  @IsString()
  password: string;
}
