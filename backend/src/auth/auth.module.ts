import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './passport/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { OtpEmailModule } from 'src/otp_email/otp_email.module';
import { MailModule } from 'src/mail/mail.module';
import { OtpPhoneModule } from 'src/otp_phone/otp_phone.module';
import { GoogleStrategy } from './passport/google.strategy';
import { FacebookStrategy } from './passport/facebook.strategy';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    OtpEmailModule,
    MailModule,
    OtpPhoneModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT-ACCESS-TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT-ACCESS-EXPIRE_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
