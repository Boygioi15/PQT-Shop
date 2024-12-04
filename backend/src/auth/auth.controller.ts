import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { OtpPhoneService } from 'src/otp_phone/otp_phone.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller('api/auth')
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
  @ResponseMessage('Register new user')
  @Post('sign-up/create-new')
  signUp(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.registerNewUser(registerUserDto, response);
  }

  @ResponseMessage('Get user refresh token')
  @Get('refresh')
  handleRefreshToken(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage('Log out')
  @Post('log-out')
  handleLogout(
    @User() user: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(user, response);
  }

  @Get('google')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('facebook')
  @Public()
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {}

  @Get('facebook/callback')
  @Public()
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req) {
    return this.authService.facebookLogin(req);
  }
}
