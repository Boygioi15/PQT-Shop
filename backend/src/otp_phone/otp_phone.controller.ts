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
}
