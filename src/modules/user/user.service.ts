import { InternalServerErrorException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { catchError, from, tap } from 'rxjs';
import { UserNotFoundException } from 'src/shared/exceptions/user-not-found.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findOneByUsername(username: string) {
    return from(this.userRepository.findOneByUsername(username)).pipe(
      tap((user) => {
        if (!user) {
          throw new UserNotFoundException();
        }
      }),
    );
  }

  saveUser(username: string, password: string) {
    return from(this.userRepository.save(username, password)).pipe(
      catchError((error) => {
        if (error.driverError) {
          const { message } = error.driverError;

          throw new InternalServerErrorException(message);
        }
        console.error(error);
        throw new InternalServerErrorException(
          'Something went wrong during the creation of the user',
        );
      }),
    );
  }
}
