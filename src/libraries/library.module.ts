import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Library, LibrarySchema } from 'src/entities/library.entity';
import { LibraryService } from './service/library.service';
import { LibrariesController } from './controller/libraries.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{name: Library.name, schema: LibrarySchema}]),
    ],
    providers: [LibraryService],
    controllers: [LibrariesController]
})
export class LibraryModule {}
