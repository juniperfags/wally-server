import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { CreateUserResponseDto } from './dtos/create-user.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: LoginResponseDto,
    status: HttpStatus.OK,
    description: 'Service encharged to generate the access token to the app',
  })
  @Post('login')
  signIn(@Body() { username, password }: LoginRequestDto) {
    return this.authService.signIn(username, password);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    type: CreateUserResponseDto,
    status: HttpStatus.CREATED,
    description: 'Service encharged to create new users',
  })
  @Post('create')
  signUp(@Body() { username, password }: LoginRequestDto) {
    return this.authService.signUp(username, password);
  }
}
