import { Injectable } from '@nestjs/common';

import { ExchangeRepository } from './exchange.repository';
import { forkJoin, from, map, switchMap, tap } from 'rxjs';
import {
  exchangeCurrency,
  mergeCurrenciesWithExchange,
} from './utils/exchange.utils';
import { ExchangeCurrencyResponseDto } from './dtos/exchange-currency-response.dto';
import { ExchangeCurrencyRequestDto } from './dtos/exchange-currency-request.dto';
import { CurrencyService } from '../currency/currency.service';
import { ExchangeEntityNotFoundException } from '../../shared/exceptions/exchange-entity-not-found.exception';
import { UpdateExchangeRateRequestDto } from './dtos/update-exchange-rate.request.dto';
import { UpdateExchangeRateResponseDto } from './dtos/update-exchange-rate.response.dto';
import { Currency } from '../currency/entities/currency.entity';

@Injectable()
export class ExchangeService {
  private listOfCurrencies = [
    new Currency({
      id: 1,
      code: 'PEN',
      name: 'Nuevo sol peruano',
    }),
    new Currency({
      id: 2,
      code: 'USD',
      name: 'Dollar americano',
    }),
  ];

  constructor(
    private readonly currencyService: CurrencyService,
    private readonly exchangeRepository: ExchangeRepository,
  ) {}

  private findOneByCurrencies(fromCurrencyId: number, toCurrencyId: number) {
    return from(
      this.exchangeRepository.findOneByCurrencies(fromCurrencyId, toCurrencyId),
    ).pipe(
      tap((exchange) => {
        if (!exchange) {
          throw new ExchangeEntityNotFoundException();
        }
      }),
    );
  }

  private findCurrenciesByCode(firstCode: string, secondCode: string) {
    return forkJoin([
      this.currencyService.findByCode(firstCode),
      this.currencyService.findByCode(secondCode),
    ]).pipe(
      map(([from, to]) => ({
        from: from.id,
        to: to.id,
      })),
    );
  }

  updateExchangeRate({
    fromCurrency,
    toCurrency,
    newExchangeRate,
  }: UpdateExchangeRateRequestDto) {
    const exchangeId$ = this.findCurrenciesByCode(fromCurrency, toCurrency);

    return exchangeId$.pipe(
      switchMap(({ from, to }) => this.findOneByCurrencies(from, to)),
      switchMap((exchange) =>
        this.exchangeRepository.saveOne({
          exchangeRate: newExchangeRate,
          fromCurrency: exchange.fromCurrency,
          toCurrency: exchange.toCurrency,
          id: exchange.id,
        }),
      ),
      map(
        ({ exchangeRate, fromCurrency, id, toCurrency }) =>
          new UpdateExchangeRateResponseDto({
            id,
            exchangeRate: exchangeRate,
            fromCurrency: fromCurrency.code,
            toCurrency: toCurrency.code,
          }),
      ),
    );
  }

  loadCurrencies() {
    return from(
      this.currencyService.saveListOfCurrencies(this.listOfCurrencies),
    ).pipe(
      map((currencies) => mergeCurrenciesWithExchange(currencies)),
      switchMap((exchanges) => this.exchangeRepository.saveBulk(exchanges)),
      map((response) => response.length),
      map((length) => ({
        details: `Quantity of exchanges created ${length}`,
      })),
    );
  }

  changeCurrency({
    originalAmount,
    originalCurrency,
    destinyCurrency,
  }: ExchangeCurrencyRequestDto) {
    const exchangeObject$ = this.findCurrenciesByCode(
      originalCurrency,
      destinyCurrency,
    );

    return exchangeObject$.pipe(
      switchMap((response) =>
        this.findOneByCurrencies(response.from, response.to),
      ),
      map(({ exchangeRate }) => exchangeRate),
      map((exchangeRate) => exchangeCurrency(originalAmount, exchangeRate)),
      map(
        ({ exchangeAmount, exchangeRate }) =>
          new ExchangeCurrencyResponseDto({
            originalAmount,
            originalCurrency,
            destinyCurrency,
            exchangeAmount,
            exchangeRate,
          }),
      ),
    );
  }
}
