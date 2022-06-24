import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;
  @IsEmail()
  readonly email: string;
  role: Role;
  @IsNotEmpty()
  readonly password: string;
}
