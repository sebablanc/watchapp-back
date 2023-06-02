import { Body, Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { YoutubeService } from '../service/youtube.service';
import { Observable, of } from 'rxjs';

@Controller('videos')
export class YoutubeController {

  constructor(private youtubeSrv: YoutubeService) { }

  @Get('/get-all')
  async getAllVideos(@Req() req: Request, @Res() res: Response) {
    try {
      let videos = await this.youtubeSrv.getVideos();
      res.status(HttpStatus.OK).send({
        success: true,
        message: 'videos encontrados',
        data: videos
      })
    } catch (error) {
      res.status(error.statusCode || error.response.statusCode).send({
        success: false,
        message: error.message || error.response.message,
        data: []
      })
    }
  }

  @Get('/get-another-page')
  async getNextPageVideos(@Req() req: Request, @Res() res: Response) {
    try {
      let videos = await this.youtubeSrv.getAnotherPageVideos(req.query.pageToken.toString());
      res.status(HttpStatus.OK).send({
        success: true,
        message: 'videos encontrados',
        data: videos
      })
    } catch (error) {
      res.status(error.statusCode || error.response.statusCode).send({
        success: false,
        message: error.message || error.response.message,
        data: []
      })
    }
  }

  @Get('/search-videos')
  async searchVideos(@Req() req: Request, @Res() res: Response) {
    try {
      let videos = await this.youtubeSrv.searchVideos(req.query.value.toString());
      res.status(HttpStatus.OK).send({
        success: true,
        message: 'videos encontrados',
        data: videos
      })
    } catch (error) {
      res.status(error.statusCode || error.response.statusCode).send({
        success: false,
        message: error.message || error.response.message,
        data: []
      })
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.log(`${operation} failed: ${error.message}`);

      return of(error.error as T);
    };
  }
}
