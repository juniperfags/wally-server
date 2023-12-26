import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserResponseDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  details: string;

  constructor(partial: Partial<CreateUserResponseDto>) {
    Object.assign(this, partial);
  }
}
