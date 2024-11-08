import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('email')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-otp')
  @Public()
  @ResponseMessage('Send OTP when signup')
  async sendOTPtoUser(@Body() body: { email: string }) {
    const { email } = body;
    return await this.mailService.sendOTPtoUser(email);
  }

  @Post('verify-otp')
  @Public()
  @ResponseMessage('Verify OTP when signup')
  async verifyOtp(@Body() body: { email: string; otpCode: string }) {
    const { email, otpCode } = body;
    return await this.mailService.verifyOtp(email, otpCode);
  }
}
