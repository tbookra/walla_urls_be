import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ValidUrlDto {
  @ApiProperty({
    description: 'creates short urls',
    example: 'www.megasport.co.il',
  })
  @IsUrl()
  url: string;
}
