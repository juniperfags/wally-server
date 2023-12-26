import { Currency } from 'src/modules/currency/entities/currency.entity';
import { Exchange } from '../entities/exchange.entity';

export const exchangeCurrency = (
  originalAmount: number,
  exchangeRate: number,
) => {
  const exchangeAmount = Number.parseFloat(
    (originalAmount * Number.parseFloat(exchangeRate.toFixed(2))).toFixed(2),
  );

  return { exchangeAmount, exchangeRate };
};
export const mergeCurrenciesWithExchange = (currencies: Currency[]) => {
  const listOfExchanges: Exchange[] = [];

  for (let counter = 0; counter < currencies.length; counter++) {
    const accumulator = counter + 1;

    if (accumulator === currencies.length) {
      break;
    }

    for (let index = 0; index < currencies.length; index++) {
      const nextIndex = index + accumulator;

      if (nextIndex >= currencies.length) {
        break;
      }

      const currentItem = currencies[index];
      const nextItem = currencies[nextIndex];

      listOfExchanges.push(
        new Exchange({
          exchangeRate: 1,
          fromCurrency: currentItem,
          toCurrency: nextItem,
        }),
        new Exchange({
          exchangeRate: 1,
          fromCurrency: nextItem,
          toCurrency: currentItem,
        }),
      );
    }
  }

  console.log(listOfExchanges);
  return listOfExchanges;
};
