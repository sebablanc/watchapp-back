import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type VideoDocument =  HydratedDocument<Video>;

@Schema()
export class Video {
    @Prop()
    video_id: string;

    @Prop()
    title: string;

    @Prop()
    imgThumbUrl: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);