import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OtpPhoneService } from './otp_phone.service';
import { Public } from 'src/decorator/customize';

@Controller('phone')
export class OtpPhoneController {
  constructor(private readonly otpPhoneService: OtpPhoneService) {}

  @Post()
  create(@Body() phone: string) {
    return this.otpPhoneService.createOTP(phone);
  }

  @Public()
  @Post('send-otp')
  async sendOtp(@Body('phone') phoneNumber: string) {
    return await this.otpPhoneService.sendOtp(phoneNumber);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(
    @Body('phone') phoneNumber: string,
    @Body('otpCode') otpCode: string,
  ) {
    return await this.otpPhoneService.verifyOtp(phoneNumber, otpCode);
  }
}
