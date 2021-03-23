import Exchange from '../Exchange';
import ExchangeEnum from '../../data/ExchangeEnum';
import MarketEnum from '../../data/MarketEnum';
import { ITimeframe } from '../Exchange';
import ICandlesticks from '../../data/ICandlesticks';
import * as OandaHelper from './OandaHelper';

export default class OandaForex extends Exchange {
	EXCHANGE = ExchangeEnum.OANDA;
	MARKET = MarketEnum.FOREX;

	fetchSymbolsList(): string[] {
		return [
			'AUD_CAD',
			'AUD_CHF',
			'AUD_JPY',
			'AUD_NZD',
			'AUD_USD',
			'CAD_CHF',
			'CAD_JPY',
			'CHF_JPY',
			'EUR_AUD',
			'EUR_CAD',
			'EUR_CHF',
			'EUR_GBP',
			'EUR_JPY',
			'EUR_NZD',
			'EUR_USD',
			'GBP_AUD',
			'GBP_CAD',
			'GBP_CHF',
			'GBP_JPY',
			'GBP_NZD',
			'GBP_USD',
			'NZD_CAD',
			'NZD_CHF',
			'NZD_JPY',
			'NZD_USD',
			'USD_CAD',
			'USD_CHF',
			'USD_JPY',
		];
	}

	fetchSymbolCandles(symbol: string, timeframe: ITimeframe): Promise<ICandlesticks[]> {
		return OandaHelper.fetch(symbol, timeframe);
	}

	initialize() {}
}
