import { Module } from '@nestjs/common';
import { OtpEmailService } from './otp_email.service';
import { OtpEmailController } from './otp_email.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpEmailSchema } from './schemas/otp_email.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'OtpEmail', schema: OtpEmailSchema }]),
  ],
  controllers: [OtpEmailController],
  providers: [OtpEmailService],
  exports: [OtpEmailService],
})
export class OtpEmailModule {}
