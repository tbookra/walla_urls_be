import {
  Controller,
  Get,
  Post,
  Req,
  Param,
  HttpException,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { ValidUrlDto } from './dtos/ValidUrl.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get_short_url/:full_url')
  async getShortUrl(@Param('full_url') full_url: string) {
    return full_url;
    const shortUrl = await this.appService.findShortUrl(full_url);
    if (!shortUrl) throw new HttpException('no url found', 404);
    return shortUrl;
  }
  @Get('get_full_url/:short_url')
  async getFullUrl(@Param('short_url') short_url: string) {
    const longUrl = await this.appService.findFullUrl(short_url);
    if (!longUrl) throw new HttpException('no url found', 404);
    return longUrl;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createUrl(@Body() urlDataDto: ValidUrlDto) {
    const rand = this.revisedRandId();
    // try {
    return this.appService.createUrl({
      ...urlDataDto,
      shortUrl: rand,
    });
    // } catch (error) {
    //   throw new HttpException('something is wrong with the url', 404);
    // }
  }

  @Get('/*')
  catchAll(@Req() req: Request) {
    `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    return {
      protocol: req.protocol,
      host: req.get('Host'),
      origin: req.originalUrl,
    };
  }
  revisedRandId() {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(2, 10);
  }
}
