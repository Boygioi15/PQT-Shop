import {
  IsString,
  IsEmail,
  IsDate,
  IsOptional,
  IsPhoneNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsDate()
  birthday: Date;

  @IsString()
  account: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber(null)
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  password_reset_code?: string;

  @IsOptional()
  @IsDate()
  password_reset_expires?: Date;
}
