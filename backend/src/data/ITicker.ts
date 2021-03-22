import MarketEnum from './/MarketEnum';
import ExchangeEnum from './ExchangeEnum';

export default interface TTickers {
	symbol: string;
	market: MarketEnum;
	exchange: ExchangeEnum;
	candlesticks: Record<string, any>; // { dailyCandles, weeklyCandles, monthlyCandles, hourlyCandles, etc.}
}
