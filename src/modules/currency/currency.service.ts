import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CurrencyRepository } from './currency.repository';
import { catchError, from, tap } from 'rxjs';
import { CurrencyNotFoundException } from '../../shared/exceptions/currency-not-found.exception';
import { Currency } from './entities/currency.entity';

@Injectable()
export class CurrencyService {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  findByCode(code: string) {
    return from(this.currencyRepository.findByCode(code)).pipe(
      tap((currency) => {
        if (!currency) {
          throw new CurrencyNotFoundException(code);
        }
      }),
    );
  }

  save(currency: Currency) {
    return from(this.currencyRepository.saveOne(currency)).pipe(
      catchError((error) => {
        if (error.driverError) {
          const { message } = error.driverError;

          throw new InternalServerErrorException(message);
        }
        throw new InternalServerErrorException(
          'Something went wrong during the creation of the currency',
        );
      }),
    );
  }

  saveListOfCurrencies(currencies: Currency[]) {
    return from(this.currencyRepository.saveBulk(currencies)).pipe(
      catchError((error) => {
        if (error.driverError) {
          const { message } = error.driverError;

          throw new InternalServerErrorException(message);
        }
        console.error(error);
        throw new InternalServerErrorException(
          'Something went wrong during the insertion of the list',
        );
      }),
    );
  }
}
