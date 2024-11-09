import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { OtpEmailService } from 'src/otp_email/otp_email.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private otpEmailService: OtpEmailService,
    private userService: UsersService,
  ) {}

  async sendOTPtoUser(email: string) {
    const foundUser = await this.userService.findOneByUsername(email);
    if (foundUser) {
      throw new BadRequestException('Email đã được đăng kí sử dụng');
    }

    const otp = await this.otpEmailService.createOTP(email);

    await this.mailerService.sendMail({
      to: email,
      from: `"Support Team" <support@example.com>`,
      subject: '',
      template: 'sendOTPSignup',
      context: {
        otp: otp.otp,
      },
    });

    return { message: 'OTP sent successfully' };
  }

  //send sp
}
