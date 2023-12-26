import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { CurrencyEnum } from 'src/modules/currency/enums/currency.enum';

export class UpdateExchangeRateRequestDto {
  @ApiProperty({
    example: 3.15,
    required: true,
  })
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsNotEmpty()
  newExchangeRate: number;

  @ApiProperty({
    enum: CurrencyEnum,
    example: 'USD',
    required: true,
  })
  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  fromCurrency: string;

  @ApiProperty({
    enum: CurrencyEnum,
    example: 'USD',
    required: true,
  })
  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  toCurrency: string;
}
