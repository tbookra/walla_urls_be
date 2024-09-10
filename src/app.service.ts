import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ValidDataDto } from './dtos/ValidData.dto';
import { Urls } from './schemas/Urls.schema';
import { verfiedShortUrls } from './constants';

@Injectable()
export class AppService {
  constructor(@InjectModel(Urls.name) private urlModel: Model<Urls>) {}
  async createUrl(createUrlDto: ValidDataDto) {
    try {
      if (verfiedShortUrls.length === 0) {
        await this.refillVerfiedShortUrls(1);
      }
      const shortUrl = verfiedShortUrls.shift();
      const newUrl = new this.urlModel({ ...createUrlDto, shortUrl });
      this.refillVerfiedShortUrls(100);
      return newUrl.save();
    } catch (error) {
      throw new HttpException('something is wrong with the url', 404);
    }
  }
  findShortUrl(fullUrl: string) {
    return this.urlModel.findOne({ url: fullUrl });
  }
  findFullUrl(shortUrl: string) {
    return this.urlModel.findOne({ shortUrl: shortUrl });
  }
  async refillVerfiedShortUrls(length: number) {
    const rand = this.revisedRandId();
    const exists = await this.findFullUrl(rand);
    if (exists) {
      await this.refillVerfiedShortUrls(length);
    } else {
      verfiedShortUrls.push(rand);
    }
    if (verfiedShortUrls.length < length) {
      await this.refillVerfiedShortUrls(length);
    }
  }
  revisedRandId() {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(2, 10);
  }
}
