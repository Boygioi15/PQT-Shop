import { Controller, Post, Body } from '@nestjs/common';
import { OtpEmailService } from './otp_email.service';

@Controller('otp-email')
export class OtpEmailController {
  constructor(private readonly otpEmailService: OtpEmailService) {}

  @Post()
  create(@Body() email: string) {
    return this.otpEmailService.createOTP(email);
  }
}
