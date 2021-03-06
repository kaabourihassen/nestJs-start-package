import { IsString } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  readonly password: string;
  @IsString()
  readonly newPassword: string;
}
