import { HttpException, HttpStatus } from '@nestjs/common';

export class CurrencyNotFoundException extends HttpException {
  constructor(currency: string) {
    super(
      `The currency ${currency} does not exists in database`,
      HttpStatus.NOT_FOUND,
    );
  }
}
