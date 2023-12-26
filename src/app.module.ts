import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExchangeModule } from './modules/exchange/exchange.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { Exchange } from 'src/modules/exchange/entities/exchange.entity';
import { Currency } from 'src/modules/currency/entities/currency.entity';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './shared/config/configuration';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'sqlite',
          database: configService.get('database.url'),
          synchronize: configService.get('database.synchronization'),
          entities: [Currency, Exchange, User],
        };
      },
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('jwt.secret'),
        signOptions: { noTimestamp: true },
      }),
    }),
    ExchangeModule,
    AuthModule,
    UserModule,
    CurrencyModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule {}
