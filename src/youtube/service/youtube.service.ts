import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import spinettaData from '../../../spinneta-response.json';
import data from '../../../total-search-response.json';
import anotherData from '../../../another-data.json';
import { Video } from 'src/entities/video.entity';
import { parseVideo } from 'src/libraries/utils';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

const OPTIONS_PARAMS = {
  part: 'snippet',
  maxResults: '30',
  regionCode: 'AR',
  type: 'video'
}


@Injectable()
export class YoutubeService {
  private options: AxiosRequestConfig = {
    params: {
      ...OPTIONS_PARAMS,
      key: this.configSrv.get('GOOGLE_KEY')
    }
  }

  private googleBaseUrl = this.configSrv.get('GOOGLE_BASE_URL');

  constructor(private http: HttpService, private configSrv: ConfigService) { }

  getVideos(): Promise<any> {
    return new Promise((resolve, reject) => {

      try {

        /*return this.http.get(this.googleBaseUrl, this.options).subscribe(
          (resp) => {
            let data = resp.data
            resolve({ ...data, items: this.adaptVideosToFront(data) })
          }
        );*/
        resolve(anotherData.data)
      } catch (error) {
        console.log(error);

        reject('error');
      }

    });
  }

  getAnotherPageVideos(pageToken: string): Promise<any> {
    return new Promise((resolve, reject) => {

      try {
        /*return this.http.get(`${this.googleBaseUrl}?pageToken=${pageToken}`, this.options).subscribe(
          (resp) => {
            let data = resp.data
            resolve({ ...data, items: this.adaptVideosToFront(data) })
          }
        );*/
        resolve({...data, items: this.adaptVideosToFront(data)}) 
      } catch (error) {
        reject('error');
      }

    });
  }

  searchVideos(value: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        return this.http.get(`${this.googleBaseUrl}?q=${value}`, this.options).subscribe(
          (resp) => {
            let data = resp.data
            resolve({...data, items: this.adaptVideosToFront(data)}) 
          }
        );
      } catch (error) {
        reject('error');
      }

    });
  }

  private adaptVideosToFront(data: any) {
    let videosProcessed: Array<Video> = [];

    let respVideoItems = data.items;

    respVideoItems.forEach(video => {
      videosProcessed.push(parseVideo(video));
    });

    return videosProcessed
  }
}
