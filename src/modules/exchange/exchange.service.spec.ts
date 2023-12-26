import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRepository } from './exchange.repository';
import { ExchangeService } from './exchange.service';
import { CurrencyService } from '../currency/currency.service';
import { lastValueFrom, of } from 'rxjs';
import { Exchange } from './entities/exchange.entity';
import { Currency } from '../currency/entities/currency.entity';
import { ExchangeCurrencyResponseDto } from './dtos/exchange-currency-response.dto';
import { CurrencyRepository } from '../currency/currency.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CurrencyNotFoundException } from '../../shared/exceptions/currency-not-found.exception';
import { ExchangeEntityNotFoundException } from '../../shared/exceptions/exchange-entity-not-found.exception';
import { UpdateExchangeRateResponseDto } from './dtos/update-exchange-rate.response.dto';

describe('Exchange service spec', () => {
  let exchangeService: ExchangeService;
  let exchangeRepositoryMock: ExchangeRepository;
  let currencyService: CurrencyService;
  let currencyRepository: CurrencyRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        CurrencyService,
        CurrencyRepository,
        {
          provide: getRepositoryToken(Currency),
          useValue: {
            findOne: (code: string) => {
              return code === 'USD'
                ? of(
                    new Currency({
                      id: 2,
                      code: 'USD',
                      name: 'Dollar americano',
                    }),
                  )
                : of(
                    new Currency({
                      id: 1,
                      code: 'PEN',

                      name: 'Nuevo sol peruano',
                    }),
                  );
            },
          },
        },
        {
          provide: ExchangeRepository,
          useValue: {
            saveOne: () => {},
            findOneByCurrencies: () => {},
            saveBulk: () => {},
          },
        },
      ],
    }).compile();

    exchangeService = module.get<ExchangeService>(ExchangeService);
    exchangeRepositoryMock = module.get<ExchangeRepository>(ExchangeRepository);
    currencyService = module.get<CurrencyService>(CurrencyService);
    currencyRepository = module.get<CurrencyRepository>(CurrencyRepository);
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should exchange the currency successfully', async () => {
    const mockExchange = new Exchange({
      id: 2,
      fromCurrency: new Currency({
        id: 2,
        code: 'USD',
        name: 'Dollar americano',
      }),
      toCurrency: new Currency({
        id: 1,
        code: 'PEN',
        name: 'Nuevo sol peruano',
      }),
      exchangeRate: 1,
    });

    jest
      .spyOn(exchangeRepositoryMock, 'findOneByCurrencies')
      .mockReturnValue(Promise.resolve(mockExchange));

    jest
      .spyOn(currencyService, 'findByCode')
      .mockImplementationOnce((code: string) => {
        switch (code) {
          case 'PEN':
            return of(
              new Currency({
                id: 1,
                code: 'PEN',

                name: 'Nuevo sol peruano',
              }),
            );
          case 'USD':
            return of(
              new Currency({
                id: 2,
                code: 'USD',
                name: 'Dollar americano',
              }),
            );
          default:
            return of(null);
        }
      });

    const response = await lastValueFrom(
      exchangeService.changeCurrency({
        originalAmount: 3.15,
        originalCurrency: 'USD',
        destinyCurrency: 'PEN',
      }),
    );

    expect(response).toStrictEqual(
      new ExchangeCurrencyResponseDto({
        exchangeRate: 1,
        destinyCurrency: 'PEN',
        exchangeAmount: 3.15,
        originalAmount: 3.15,
        originalCurrency: 'USD',
      }),
    );
  });
  it('should throw an ExchangeEntityNotFoundException class', async () => {
    jest
      .spyOn(exchangeRepositoryMock, 'findOneByCurrencies')
      .mockReturnValueOnce(Promise.resolve(null));

    try {
      await lastValueFrom(
        exchangeService.changeCurrency({
          originalAmount: 3.15,
          originalCurrency: 'USD',
          destinyCurrency: 'EUR',
        }),
      );
    } catch (error) {
      const isExchangeEntityNotFoundException =
        error instanceof ExchangeEntityNotFoundException;

      expect(isExchangeEntityNotFoundException).toBe(true);
    }
  });
  it('should throw an CurrencyNotFoundException class', async () => {
    jest
      .spyOn(exchangeRepositoryMock, 'findOneByCurrencies')
      .mockReturnValue(Promise.resolve(null));

    jest
      .spyOn(currencyRepository, 'findByCode')
      .mockReturnValue(Promise.resolve(null));

    try {
      await lastValueFrom(
        exchangeService.changeCurrency({
          originalAmount: 3.15,
          originalCurrency: 'USD',
          destinyCurrency: 'EUR',
        }),
      );
    } catch (error) {
      const isCurrencyNotFoundException =
        error instanceof CurrencyNotFoundException;

      expect(isCurrencyNotFoundException).toBe(true);
    }
  });
  it('should update the exchange rate of the entity', async () => {
    const mockExchange = new Exchange({
      id: 2,
      fromCurrency: new Currency({
        id: 2,
        code: 'USD',
        name: 'Dollar americano',
      }),
      toCurrency: new Currency({
        id: 1,
        code: 'PEN',
        name: 'Nuevo sol peruano',
      }),
      exchangeRate: 1,
    });

    jest
      .spyOn(exchangeRepositoryMock, 'findOneByCurrencies')
      .mockReturnValueOnce(Promise.resolve(mockExchange));
    jest
      .spyOn(exchangeRepositoryMock, 'saveOne')
      .mockReturnValueOnce(
        Promise.resolve({ ...mockExchange, exchangeRate: 3.15 }),
      );

    jest
      .spyOn(currencyService, 'findByCode')
      .mockImplementationOnce((code: string) => {
        switch (code) {
          case 'PEN':
            return of(
              new Currency({
                id: 1,
                code: 'PEN',

                name: 'Nuevo sol peruano',
              }),
            );
          case 'USD':
            return of(
              new Currency({
                id: 2,
                code: 'USD',
                name: 'Dollar americano',
              }),
            );
          default:
            return of(null);
        }
      });

    const response = await lastValueFrom(
      exchangeService.updateExchangeRate({
        newExchangeRate: 3.15,
        fromCurrency: 'USD',
        toCurrency: 'PEN',
      }),
    );

    expect(response).toStrictEqual(
      new UpdateExchangeRateResponseDto({
        id: 2,
        exchangeRate: 3.15,
        fromCurrency: 'USD',
        toCurrency: 'PEN',
      }),
    );
  });
});
