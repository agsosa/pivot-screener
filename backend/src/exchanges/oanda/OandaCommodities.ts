import Exchange from '../base/Exchange';
import DataManager from '../../data/DataManager';
import ExchangeEnum from '../../data/ExchangeEnum';
import MarketEnum from '../../data/MarketEnum';
import { ITimeframe } from '../base/Exchange';
import ICandlesticks from '../../data/ICandlesticks';
import axios from 'axios';
import * as OandaHelper from './OandaHelper';

export default class OandaCommodities extends Exchange {
	EXCHANGE = ExchangeEnum.OANDA;
	MARKET = MarketEnum.COMMODITIES;

	fetchSymbolsList(): string[] {
		return ['XPT_USD', 'XCU_USD', 'SOYBN_USD', 'XAU_EUR', 'CORN_USD', 'XAG_EUR', 'SUGAR_USD', 'NATGAS_USD', 'BCO_USD', 'XAG_USD', 'XAU_USD', 'WHEAT_USD', 'XPD_USD', 'WTICO_USD'];
	}

	fetchSymbolCandles(symbol: string, timeframe: ITimeframe): Promise<ICandlesticks[]> {
		return OandaHelper.fetch(symbol, timeframe);
	}

	initialize() {}
}
