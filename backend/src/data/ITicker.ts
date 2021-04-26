import MarketEnum from 'data/MarketEnum';
import ExchangeEnum from 'data/ExchangeEnum';

export default interface TTickers {
  symbol: string;
  market: MarketEnum;
  exchange: ExchangeEnum;
  candlesticks: Record<string, any>; // { dailyCandles, weeklyCandles, monthlyCandles, hourlyCandles, etc.}
}
