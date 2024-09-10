import {  IsUrl } from 'class-validator';

export class ValidUrlDto {
  @IsUrl()
  url: string;
}
