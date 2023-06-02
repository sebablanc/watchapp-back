import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { logger } from './middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { YoutubeModule } from './youtube/youtube.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LibraryModule } from './libraries/library.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

const configSrv = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './environments/.development.env',
      isGlobal: true,
      cache: true
    }),
    MongooseModule.forRoot(`${configSrv.get('MONGO_PREFIX')}://${configSrv.get('MONGO_USER')}:${configSrv.get('MONGO_PASS')}@${configSrv.get('MONGO_SERVER')}/${configSrv.get('MONGO_DB')}?retryWrites=true&w=majority`),
    AuthModule,
    YoutubeModule,
    LibraryModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(logger)
      .forRoutes('users')
  }
}
