import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Library } from 'src/entities/library.entity';

@Injectable()
export class LibraryService {

  constructor(
    @InjectModel(Library.name) private libraryModel: Model<Library>
  ) { }

  async getUserLibraries(userId: string){
    return this.libraryModel.find({user_id: userId})
  }
  /**
   * Agrega un video a una bilbioteca existente,
   * si la biblioteca no existe, la crea y guarda el video
   * @param library 
   * @returns el documento modificado
   */
  async addVideoToLibrary(library: Library) {
    let libraryFinded = await this.verifyLibraryExists(library);
    if(libraryFinded && libraryFinded.video_list.filter(video => video.video_id === library.video_list[0].video_id).length > 0) return;

    const createdLibrary = new this.libraryModel(libraryFinded || library);
    if(libraryFinded !== null){
      createdLibrary.video_list.push(library.video_list[0]);
    }
    return createdLibrary.save();
  }

  async deleteFromLibrary(library: Library) {
    let libraryFinded = await this.verifyLibraryExists(library);
    if(!libraryFinded || libraryFinded.video_list.filter(video => video.video_id === library.video_list[0].video_id).length < 0) return;
    let videosFiltered = libraryFinded.video_list.filter(video => video.video_id !== library.video_list[0].video_id)
    
    libraryFinded.video_list = videosFiltered;
    const createdLibrary = new this.libraryModel(libraryFinded);
    return createdLibrary.save();
  }

  private async verifyLibraryExists(library: Library) {
    return await this.libraryModel.findOne({ name: library.name, user_id: library.user_id });
  }
}
