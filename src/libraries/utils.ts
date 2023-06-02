import { Library } from "src/entities/library.entity";
import { Video } from "src/entities/video.entity";

export function parseLibrary(id: string, libraryName: string, video: Video){
    let libraryParsed: Library = new Library();
    libraryParsed.user_id = id;
    libraryParsed.name = libraryName;
    libraryParsed.video_list.push(video);
    return libraryParsed;
}

export function parseVideo(video: any){
    let videoParsed: Video ={
        imgThumbUrl: video['snippet']['thumbnails']['medium']['url'],
        title:  video['snippet']['title'],
        video_id:  video['id']['videoId']
    }
    return videoParsed;
}