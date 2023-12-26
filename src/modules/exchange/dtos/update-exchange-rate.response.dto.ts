import { ApiProperty } from '@nestjs/swagger';
import { CurrencyEnum } from '../../../modules/currency/enums/currency.enum';

export class UpdateExchangeRateResponseDto {
  @ApiProperty({
    required: true,
    example: 1,
  })
  id: number;

  @ApiProperty({
    enum: CurrencyEnum,
    example: 'USD',
    required: true,
  })
  fromCurrency: string;

  @ApiProperty({
    enum: CurrencyEnum,
    example: 'USD',
    required: true,
  })
  toCurrency: string;

  @ApiProperty({
    required: true,
    example: 3.45,
  })
  exchangeRate: number;

  constructor(partial: Partial<UpdateExchangeRateResponseDto>) {
    Object.assign(this, partial);
  }
}
