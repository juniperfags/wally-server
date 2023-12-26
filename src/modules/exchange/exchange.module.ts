import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exchange } from './entities/exchange.entity';
import { ExchangeRepository } from './exchange.repository';
import { ExchangeService } from './exchange.service';
import { CurrencyModule } from '../currency/currency.module';
import { ExchangeController } from './exchange.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Exchange]), CurrencyModule, JwtModule],
  providers: [ExchangeRepository, ExchangeService],
  exports: [TypeOrmModule],
  controllers: [ExchangeController],
})
export class ExchangeModule implements OnApplicationBootstrap {
  constructor(private readonly exchangeService: ExchangeService) {}
  onApplicationBootstrap() {
    this.exchangeService
      .loadCurrencies()
      .subscribe((response) => console.log(response));
  }
}
