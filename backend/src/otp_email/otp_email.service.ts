import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OtpEmail, OtpEmailDocument } from './schemas/otp_email.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OtpEmailService {
  constructor(
    @InjectModel(OtpEmail.name) private otpEmailModel: Model<OtpEmailDocument>,
  ) {}
  async createOTP(email: string) {
    const foundOtp = await this.otpEmailModel.findOne({ email });
    if (foundOtp) throw new BadRequestException('Email exists');

    const otp = this.generateOtp();
    return await this.otpEmailModel.create({ otp, email });
  }
  generateOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }

  async findOTP(email: string, otpCode: string) {
    return await this.otpEmailModel.findOne({ email, otp: otpCode });
  }
}
