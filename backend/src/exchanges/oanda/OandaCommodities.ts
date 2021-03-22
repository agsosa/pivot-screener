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
	MARKET = MarketEnum.COMMODITIES;

	constructor(DataManager: DataManager) {
		super(DataManager);
	}

	fetchSymbolsList(): string[] {
		return [
			'XPT_USD',
			'XCU_USD',
			'SOYBN_USD',
			'XAG_SGD',
			'XAU_HKD',
			'XAG_CHF',
			'XAU_EUR',
			'CORN_USD',
			'XAG_AUD',
			'XAU_SGD',
			'XAG_EUR',
			'SUGAR_USD',
			'NATGAS_USD',
			'BCO_USD',
			'XAU_AUD',
			'XAG_USD',
			'XAU_JPY',
			'XAU_CAD',
			'XAG_NZD',
			'XAG_JPY',
			'XAG_HKD',
			'XAU_USD',
			'WHEAT_USD',
			'XAU_CHF',
			'XPD_USD',
			'XAG_CAD',
			'XAU_GBP',
			'WTICO_USD',
			'XAG_GBP',
		];
	}

	fetchSymbolCandles(symbol: string, timeframe: ITimeframe): Promise<ICandlesticks> {}

	initialize() {}
}
*/
