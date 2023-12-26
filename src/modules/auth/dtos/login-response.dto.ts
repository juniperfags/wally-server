import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class LoginResponseDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsJWT()
  accessToken: string;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
