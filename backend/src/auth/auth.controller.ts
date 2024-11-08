import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(AuthGuard('local'))
  signIn(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
