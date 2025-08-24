import { IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  nickname: string;

  @IsString()
  password: string;
}
