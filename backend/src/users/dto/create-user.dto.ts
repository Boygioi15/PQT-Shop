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

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name không được để trống ' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;

  @IsNotEmpty({ message: 'age không được để trống' })
  age: string;

  @IsNotEmpty({ message: 'gender không được để trống' })
  gender: string;

  @IsNotEmpty({ message: 'address không được để trống' })
  address: string;
}
