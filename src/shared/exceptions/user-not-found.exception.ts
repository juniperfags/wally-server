import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('Cannot find the user in database', HttpStatus.NOT_FOUND);
  }
}
