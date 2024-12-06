import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { TransformInterceptor } from './interceptor/transform.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  //cors config
  app.enableCors({
    credentials: true,
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // config cookied parser
  app.use(cookieParser());

  //config interceptor
  //app.useGlobalInterceptors(new TransformInterceptor(reflector));

  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
