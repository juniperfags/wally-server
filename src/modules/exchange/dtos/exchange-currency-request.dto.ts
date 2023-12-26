import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { CurrencyEnum } from 'src/modules/currency/enums/currency.enum';

export class ExchangeCurrencyRequestDto {
  @ApiProperty({
    example: 3.15,
    required: true,
  })
  @IsPositive()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'originalAmount must be a number with two max decimal places',
    },
  )
  @IsNotEmpty()
  originalAmount: number;

  @ApiProperty({
    enum: CurrencyEnum,
    example: 'USD',
    required: true,
  })
  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  originalCurrency: string;

  @ApiProperty({
    enum: CurrencyEnum,
    example: 'PEN',
    required: true,
  })
  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  destinyCurrency: string;
}
