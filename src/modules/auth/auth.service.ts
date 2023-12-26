import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { from, map, switchMap, tap } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserResponseDto } from './dtos/create-user.response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signIn(username: string, inputPassword: string) {
    return from(this.userService.findOneByUsername(username)).pipe(
      map(({ password }) => password),
      switchMap((hash) =>
        this.compare(inputPassword, hash).pipe(map((response) => response)),
      ),
      tap((isEqual) => {
        if (!isEqual) {
          throw new UnauthorizedException('Invalid credentials!');
        }
      }),
      map(() =>
        this.jwtService.sign(
          {
            username,
            timestamp: new Date(),
          },
          {
            secret: this.configService.get('jwt.secret'),
          },
        ),
      ),
      map((token) => ({
        accessToken: token,
      })),
    );
  }
  signUp(username: string, plainPassword: string) {
    return from(this.encrypt(plainPassword)).pipe(
      switchMap((hash) => this.userService.saveUser(username, hash)),
      map(
        ({ id, username }) =>
          new CreateUserResponseDto({
            details: `User with username ${username} and id ${id} was created successfully!!!`,
          }),
      ),
    );
  }

  encrypt(plainString: string) {
    return from(bcrypt.genSalt()).pipe(
      map((salt) => salt),
      switchMap((salt) => bcrypt.hash(plainString, salt)),
    );
  }

  compare(inputPlainString: string, hash: string) {
    return from(bcrypt.compare(inputPlainString, hash));
  }
}
