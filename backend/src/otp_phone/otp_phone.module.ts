import { Module } from '@nestjs/common';
import { OtpPhoneService } from './otp_phone.service';
import { OtpPhoneController } from './otp_phone.controller';
import { OtpPhoneSchema } from './schemas/otp_phone.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'OtpPhone', schema: OtpPhoneSchema }]),
  ],
  controllers: [OtpPhoneController],
  providers: [OtpPhoneService],
  exports: [OtpPhoneService],
})
export class OtpPhoneModule {}
