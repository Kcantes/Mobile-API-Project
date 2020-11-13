import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface Film {
    title: string;
    url: string;
    summary: string;
    aggregated_rating: number;
    authors: string[];
    casting: string[];
    genres: string[];
    keywords: string[];
    first_release_date: string;
    runtime: number;
    cover: string;
    members: number;
    size: number;
    date_added: string;
}

@Schema({ collection: 'IMDB_LIGHT' })
export class FilmDocument extends Document {
    @Prop()
    title: string;
    @Prop()
    url: string;
    @Prop()
    summary: string;
    @Prop()
    aggregated_rating: number;
    @Prop()
    authors: string[];
    @Prop()
    casting: string[];
    @Prop()
    genres: string[];
    @Prop()
    keywords: string[];
    @Prop()
    first_release_date: string;
    @Prop()
    runtime: number;
    @Prop()
    cover: string;
    @Prop()
    members: number;
    @Prop()
    size: number;
    @Prop()
    date_added: string;
}

export const FilmSchema = SchemaFactory.createForClass(FilmDocument);

