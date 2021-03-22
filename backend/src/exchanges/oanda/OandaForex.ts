/*import Exchange from '../base/Exchange';
import DataManager from '../../data/DataManager';
import ExchangeEnum from '../base/ExchangeEnum';
import MarketEnum from '../base/MarketEnum';
import { ITimeframe } from '../base/Exchange';
import ICandlesticks from '../../data/ICandlesticks';
import axios from 'axios';
import * as OandaHelper from './OandaHelper';

export default class OandaForex extends Exchange {
	EXCHANGE = ExchangeEnum.OANDA;
	MARKET = MarketEnum.FOREX;

	constructor(DataManager: DataManager) {
		super(DataManager);
	}

	fetchSymbolsList(): string[] {
		return [
			'TRY_JPY',
			'EUR_AUD',
			'EUR_USD',
			'HKD_JPY',
			'SGD_JPY',
			'USD_NOK',
			'EUR_CZK',
			'USD_HKD',
			'NZD_CHF',
			'USD_HUF',
			'EUR_PLN',
			'GBP_HKD',
			'GBP_PLN',
			'CHF_JPY',
			'AUD_NZD',
			'USD_CHF',
			'GBP_NZD',
			'XAU_NZD',
			'EUR_GBP',
			'USD_PLN',
			'GBP_SGD',
			'EUR_HUF',
			'SGD_CHF',
			'GBP_USD',
			'USD_SEK',
			'AUD_JPY',
			'AUD_HKD',
			'EUR_NZD',
			'EUR_SGD',
			'CHF_ZAR',
			'EUR_TRY',
			'GBP_CAD',
			'GBP_ZAR',
			'USD_ZAR',
			'USD_INR',
			'NZD_JPY',
			'USD_CZK',
			'CHF_HKD',
			'AUD_CHF',
			'USD_JPY',
			'AUD_CAD',
			'SGD_HKD',
			'NZD_CAD',
			'NZD_SGD',
			'NZD_USD',
			'EUR_CAD',
			'EUR_DKK',
			'GBP_AUD',
			'CAD_CHF',
			'USD_DKK',
			'GBP_CHF',
			'USD_CAD',
			'GBP_JPY',
			'AUD_USD',
			'CAD_SGD',
			'USD_TRY',
			'CAD_JPY',
			'USD_SGD',
			'USD_CNH',
			'USD_THB',
			'EUR_NOK',
			'EUR_ZAR',
			'EUR_CHF',
			'USD_MXN',
			'ZAR_JPY',
			'AUD_SGD',
		];
	}

	fetchSymbolCandles(symbol: string, timeframe: ITimeframe): Promise<ICandlesticks> {}

	initialize() {}
}
*/
