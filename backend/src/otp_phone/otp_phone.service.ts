import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OtpPhone, OtpPhoneDocument } from './schemas/otp_phone.schema';
import { Model } from 'mongoose';
import { Vonage } from '@vonage/server-sdk';
import { ConfigService } from '@nestjs/config';
import { Auth } from '@vonage/auth';
@Injectable()
export class OtpPhoneService {
  private vonage: Vonage;
  private otpExpiryMinutes: number;
  constructor(
    @InjectModel(OtpPhone.name) private otpPhoneModel: Model<OtpPhoneDocument>,
    private configService: ConfigService,
  ) {
    const auth = new Auth({
      apiKey: this.configService.get<string>('VONAGE-API-KEY'),
      apiSecret: this.configService.get<string>('VONAGE-API-SECRET'),
    });

    this.vonage = new Vonage(auth);
    this.otpExpiryMinutes = this.configService.get<number>(
      'OTP_EXPIRY_MINUTES',
      5,
    );
  }
  async createOTP(phone: string) {
    const foundOtp = await this.otpPhoneModel.findOne({ phone });
    if (foundOtp) throw new BadRequestException('phone exists');

    const otp = this.generateOtp();
    return await this.otpPhoneModel.create({ otp, phone });
  }
  generateOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }

  async findOTP(phone: string, otpCode: string) {
    return await this.otpPhoneModel.findOne({ phone, otp: otpCode });
  }

  async sendOtp(phoneNumber: string) {
    const otp = await this.createOTP(phoneNumber);
    const from = 'PQT-Shop';
    const text = `Your OTP code is: ${otp.otp}`;
    let phoneVN = '+84' + phoneNumber.slice(1);
    try {
      const response = await this.vonage.sms.send({
        to: phoneVN,
        from,
        text,
      });
      return { message: 'OTP verified successfully' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new BadRequestException('Could not send OTP');
    }
  }
}
