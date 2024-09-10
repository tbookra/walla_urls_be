import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Urls {
  @Prop({ unique: true, required: true })
  url: string;
  @Prop({ unique: true, required: true })
  shortUrl: string;
}

export const UrlsSchema = SchemaFactory.createForClass(Urls);
