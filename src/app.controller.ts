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
    return this.appService.createUrl({ url: urlDataDto.url });
  }

  @Get('/*')
  async catchAll(@Req() req: Request) {
    const shortUrl = req.originalUrl.substring(1);
    const longUrl = await this.appService.findFullUrl(shortUrl);

    return {
      origin: longUrl,
    };
  }
  
  revisedRandId() {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(2, 10);
  }
}
