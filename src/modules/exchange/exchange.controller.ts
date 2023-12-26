import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExchangeCurrencyRequestDto } from './dtos/exchange-currency-request.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExchangeService } from './exchange.service';
import { ExchangeCurrencyResponseDto } from './dtos/exchange-currency-response.dto';
import { AuthorizationGuard } from 'src/shared/guards/authorization.guard';
import { UpdateExchangeRateRequestDto } from './dtos/update-exchange-rate.request.dto';
import { UpdateExchangeRateResponseDto } from './dtos/update-exchange-rate.response.dto';

@ApiTags('Exchange')
@ApiBearerAuth()
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @ApiResponse({
    type: ExchangeCurrencyResponseDto,
    status: HttpStatus.OK,
    description:
      'Service encharged to exchange the requested amount with the destiny currency',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthorizationGuard)
  @Post()
  changeCurrency(@Body() requestBody: ExchangeCurrencyRequestDto) {
    return this.exchangeService.changeCurrency(requestBody);
  }

  @ApiResponse({
    type: UpdateExchangeRateResponseDto,
    status: HttpStatus.CREATED,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthorizationGuard)
  @Post('update-exchange-rate')
  updateExchangeRate(@Body() requestBody: UpdateExchangeRateRequestDto) {
    return this.exchangeService.updateExchangeRate(requestBody);
  }
}
