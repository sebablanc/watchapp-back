import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Video } from "./video.entity";

export type LibraryDocument =  HydratedDocument<Library>;

@Schema()
export class Library {
    @Prop()
    user_id: string;

    @Prop()
    name: string;

    @Prop()
    video_list: Video[] = [];
}

export const LibrarySchema = SchemaFactory.createForClass(Library);