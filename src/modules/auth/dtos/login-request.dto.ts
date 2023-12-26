import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    example: 'jhon.doe12',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;
}
