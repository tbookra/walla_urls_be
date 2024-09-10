import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class ValidDataDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;
  @IsString()
  shortUrl: string;
}
