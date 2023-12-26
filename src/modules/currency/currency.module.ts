import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { CurrencyService } from './currency.service';
import { CurrencyRepository } from './currency.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  exports: [CurrencyService, TypeOrmModule],
  providers: [CurrencyService, CurrencyRepository],
})
export class CurrencyModule {}
