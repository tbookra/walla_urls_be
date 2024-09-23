import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ValidDataDto } from './dtos/ValidData.dto';
import { Urls } from './schemas/Urls.schema';
import { verifiedShortUrls } from './constants';

@Injectable()
export class AppService {
  constructor(@InjectModel(Urls.name) private urlModel: Model<Urls>) {}
  async createUrl(createUrlDto: ValidDataDto) {
    try {
      if (verifiedShortUrls.length === 0) {
        await this.refillVerifiedShortUrls(1);
      }
      const shortUrl = verifiedShortUrls.shift();
      const newUrl = new this.urlModel({ ...createUrlDto, shortUrl });
      if (verifiedShortUrls.length < 80) {
        this.refillVerifiedShortUrls(100);
      }
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
  async refillVerifiedShortUrls(verifiedMinLength: number) {
    const rand = this.makeId(7);
    const exists = await this.findFullUrl(rand);
    if (exists) {
      await this.refillVerifiedShortUrls(verifiedMinLength);
    } else {
      verifiedShortUrls.push(rand);
    }
    if (verifiedShortUrls.length < verifiedMinLength) {
      await this.refillVerifiedShortUrls(verifiedMinLength);
    }
  }
  makeId(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
}
