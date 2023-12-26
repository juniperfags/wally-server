import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';

@Injectable()
export class CurrencyRepository {
  constructor(
    @InjectRepository(Currency)
    private readonly currentRepository: Repository<Currency>,
  ) {}

  findByCode(code: string) {
    return this.currentRepository.findOne({
      where: {
        code,
      },
    });
  }
  saveOne(currency: Currency) {
    return this.currentRepository.save({
      code: currency.code,
      name: currency.name,
    });
  }
  saveBulk(currencies: Currency[]) {
    return this.currentRepository.save(currencies);
  }
}
