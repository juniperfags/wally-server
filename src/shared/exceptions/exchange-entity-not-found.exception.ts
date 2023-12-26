import { HttpException, HttpStatus } from '@nestjs/common';

export class ExchangeEntityNotFoundException extends HttpException {
  constructor() {
    super('Cannot find the requested exchange entity', HttpStatus.NOT_FOUND);
  }
}
