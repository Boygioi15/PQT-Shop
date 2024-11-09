import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { OtpPhoneService } from 'src/otp_phone/otp_phone.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly phoneService: OtpPhoneService,
  ) {}

  @Public()
  @Post('sign-in')
  @UseGuards(AuthGuard('local'))
  signIn(@Request() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @Post('sign-in/phone')
  signInWithPhone(
    @Body() body: { phone: string; otpCode: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { phone, otpCode } = body;
    return this.authService.loginWithOtp(phone, otpCode, response);
  }

  @Public()
  @Post('sign-up/email/send-code')
  signUpwithEmail(@Body('email') email: string) {
    return this.mailService.sendOTPtoUser(email);
  }

  @Post('sign-up/email/verify-code')
  @Public()
  @ResponseMessage('Verify OTP when signup')
  async verifyOtp(@Body() body: { email: string; otpCode: string }) {
    const { email, otpCode } = body;
    return await this.authService.verifyOtpEmail(email, otpCode);
  }

  @Public()
  @Post('sign-up/phone/send-code')
  signUpWithPhone(@Body('phone') phone: string) {
    return this.phoneService.sendOtp(phone);
  }

  @Public()
  @Post('sign-up/phone/verify-code')
  signUp(@Body() body: { phone: string; otpCode: string }) {
    const { phone, otpCode } = body;
    return this.authService.verifyOtpPhone(phone, otpCode);
  }
}
