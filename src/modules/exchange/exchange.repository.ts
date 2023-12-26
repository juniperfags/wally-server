import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exchange } from './entities/exchange.entity';

@Injectable()
export class ExchangeRepository {
  constructor(
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>,
  ) {}

  saveOne(exchange: Exchange) {
    return this.exchangeRepository.save(exchange);
  }

  saveBulk(exchanges: Exchange[]) {
    return this.exchangeRepository.save(exchanges);
  }

  findOneByCurrencies(fromCurrency: number, toCurrency: number) {
    return this.exchangeRepository.findOne({
      relations: ['fromCurrency', 'toCurrency'],
      where: {
        fromCurrency: {
          id: fromCurrency,
        },
        toCurrency: {
          id: toCurrency,
        },
      },
    });
  }
}
