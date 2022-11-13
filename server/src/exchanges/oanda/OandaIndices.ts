import Exchange from '../Exchange';
import ExchangeEnum from '../../data/ExchangeEnum';
import MarketEnum from '../../data/MarketEnum';
import { ITimeframe } from '../Exchange';
import ICandlesticks from '../../data/ICandlesticks';
import * as OandaHelper from './OandaHelper';

export default class OandaIndices extends Exchange {
	EXCHANGE = ExchangeEnum.OANDA;
	MARKET = MarketEnum.INDICES;

	fetchSymbolsList(): string[] {
		return [
			'US30_USD',
			'HK33_HKD',
			'JP225_USD',
			'SPX500_USD',
			'UK100_GBP',
			'IN50_USD',
			'US2000_USD',
			'DE30_EUR',
			'CN50_USD',
			'AU200_AUD',
			'NL25_EUR',
			'EU50_EUR',
			'NAS100_USD',
			'TWIX_USD',
			'SG30_SGD',
		];
	}

	fetchSymbolCandles(symbol: string, timeframe: ITimeframe): Promise<ICandlesticks[]> {
		return OandaHelper.fetch(symbol, timeframe);
	}

	initialize() {}
}
