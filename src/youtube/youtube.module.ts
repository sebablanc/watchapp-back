import { Module } from '@nestjs/common';
import { YoutubeService } from './service/youtube.service';
import { HttpModule } from '@nestjs/axios';
import { YoutubeController } from './controller/youtube.controller';

@Module({
    imports: [
        HttpModule
    ],
    providers: [YoutubeService],
    controllers: [YoutubeController]
})
export class YoutubeModule {}
