import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class ValidDataDto {
  @ApiProperty({
    description: 'ensuring a valid url',
    example: 'www.google.com',
  })
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
