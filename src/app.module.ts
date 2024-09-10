import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Urls, UrlsSchema } from './schemas/Urls.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/short_urls'),
    MongooseModule.forFeature([
      {
        name: Urls.name,
        schema: UrlsSchema,
      },
    ]),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
