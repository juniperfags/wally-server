import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { CurrencyEnum } from '../../../modules/currency/enums/currency.enum';

export class ExchangeCurrencyResponseDto {
  @ApiProperty({
    example: 3.15,
    required: true,
  })
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsNotEmpty()
  originalAmount: number;

  @ApiProperty({ example: 10.52, required: true })
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsNotEmpty()
  exchangeAmount: number;

  @ApiProperty({
    enum: CurrencyEnum,
    example: 'USD',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(CurrencyEnum)
  originalCurrency: string;

  @ApiProperty({
    enum: CurrencyEnum,
    example: 'PEN',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(CurrencyEnum)
  destinyCurrency: string;

  @ApiProperty({
    example: 3.34,
    required: true,
  })
  @IsPositive()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsNotEmpty()
  exchangeRate: number;

  constructor(partial: Partial<ExchangeCurrencyResponseDto>) {
    Object.assign(this, partial);
  }
}
