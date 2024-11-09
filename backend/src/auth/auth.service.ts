import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { OtpEmailService } from 'src/otp_email/otp_email.service';
import { OtpPhoneService } from 'src/otp_phone/otp_phone.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpEmailService: OtpEmailService,
    private otpPhoneService: OtpPhoneService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValidPassword = await this.usersService.isValidPassword(
        pass,
        user.password,
      );

      if (isValidPassword) {
        return user;
      }
    }

    return null;
  }

  async login(user: any, response: Response) {
    const { _id, name, email, phone } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      phone,
    };
    const refreshToken = this.createRefreshToken(payload);

    // update user with refresh token
    await this.usersService.updateUserToken(refreshToken, _id);

    //set refresh token at cookies
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT-REFRESH-EXPIRE_IN')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: { _id, name, email, phone },
    };
  }

  logout = (user, response: Response) => {
    this.usersService.updateUserToken(null, user._id);
    response.clearCookie('refresh_token');
    return 'done';
  };

  async processNewToken(refreshToken: string, response: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT-REFRESH-TOKEN_SECRET'),
      });

      let user = await this.usersService.findUserByToken(refreshToken);

      if (user) {
        // update refresh token
        const { _id, name, email, phone } = user;
        const payload = {
          sub: 'refresh token ',
          iss: 'from server',
          _id,
          name,
          email,
          phone,
        };
        const refreshToken = this.createRefreshToken(payload);

        // update user with refresh token
        await this.usersService.updateUserToken(refreshToken, _id.toString());

        //set refresh token at cookies
        response.clearCookie('refresh_token');

        response.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT-REFRESH-EXPIRE_IN')), //milisecond
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: { _id, name, email, phone },
        };
      } else {
        throw new BadRequestException('Refresh token không hợp lệ');
      }
    } catch (error) {
      throw new BadRequestException('Refresh token không hợp lệ');
    }
  }

  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT-REFRESH-TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT-REFRESH-EXPIRE_IN')) / 1000,
    });
    return refreshToken;
  };

  async verifyOtpEmail(email: string, otpCode: string) {
    const checkOtp = await this.otpEmailService.findOTP(email, otpCode);
    if (!checkOtp) throw new BadRequestException('Mã OTP không chính xác');

    return true;
  }

  async verifyOtpPhone(phone: string, otpCode: string) {
    const checkOtp = await this.otpPhoneService.findOTP(phone, otpCode);
    if (!checkOtp) throw new BadRequestException('Mã OTP không chính xác');

    return { message: 'OTP verified successfully' };
  }

  async loginWithOtp(phone: string, otpCode: string, response: Response) {
    await this.verifyOtpPhone(phone, otpCode);

    const user = await this.usersService.findOneByUsername(phone);
    if (!user) throw new BadRequestException('User not sginup');
    await this.login(user, response);
  }
}
