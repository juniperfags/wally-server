import { CurrencyService } from './currency.service';
import { Currency } from './entities/currency.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyRepository } from './currency.repository';
import { lastValueFrom, of } from 'rxjs';
import { CurrencyNotFoundException } from '../../shared/exceptions/currency-not-found.exception';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';

describe('Currency service spec', () => {
  let service: CurrencyService;
  let repositoryMock: CurrencyRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: CurrencyRepository,
          useValue: {
            findByCode: (code: string) => {
              return of(code);
            },
            saveOne: () => {},
            saveBulk: () => {},
          },
        },
      ],
    }).compile();
    service = module.get<CurrencyService>(CurrencyService);
    repositoryMock = module.get<CurrencyRepository>(CurrencyRepository);
  });
  it('should save currency successfully', async () => {
    const newCurrency = new Currency({ code: 'EUR', name: 'Euro' });

    jest
      .spyOn(repositoryMock, 'saveOne')
      .mockReturnValue(Promise.resolve(newCurrency));
    const savedCurrency = await lastValueFrom(service.save(newCurrency));

    expect(savedCurrency).toEqual(newCurrency);
    expect(repositoryMock.saveOne).toHaveBeenCalledWith(newCurrency);
  });

  it('should handle repository errors', async () => {
    const newCurrency = new Currency({ code: 'JPY', name: 'Japanese Yen' });
    const mockError = new Error('Database error');

    jest
      .spyOn(repositoryMock, 'saveOne')
      .mockReturnValue(Promise.reject(mockError));

    try {
      await lastValueFrom(service.save(newCurrency));
    } catch (error) {
      const isCurrencyNotFoundException =
        error instanceof InternalServerErrorException;
      expect(error).toBeDefined();
      expect(error.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(isCurrencyNotFoundException).toBe(true);
    }
  });

  it('should return currency when found', async () => {
    const existingCurrency = new Currency({ code: 'USD', name: 'US Dollar' });

    jest
      .spyOn(repositoryMock, 'findByCode')
      .mockReturnValue(Promise.resolve(existingCurrency));

    const foundCurrency = await lastValueFrom(service.findByCode('USD'));

    expect(foundCurrency).toStrictEqual(existingCurrency);
  });

  it('should throw CurrencyNotFoundException when not found', async () => {
    jest
      .spyOn(repositoryMock, 'findByCode')
      .mockReturnValue(Promise.resolve(null));

    try {
      await lastValueFrom(service.findByCode('NOT_FOUND'));
    } catch (error) {
      const isCurrencyNotFoundException =
        error instanceof CurrencyNotFoundException;
      expect(error).toBeDefined();
      expect(error.status).toEqual(HttpStatus.NOT_FOUND);
      expect(isCurrencyNotFoundException).toBe(true);
    }
  });
});
