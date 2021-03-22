import Exchange from '../base/Exchange';
import DataManager from '../../data/DataManager';
import ExchangeEnum from '../base/ExchangeEnum';
import MarketEnum from '../base/MarketEnum';
import { ITimeframe } from '../base/Exchange';
import ICandlesticks from '../../data/ICandlesticks';
import axios from 'axios';
import * as OandaHelper from './OandaHelper';
import moment from 'moment';

export default class OandaForex extends Exchange {
	EXCHANGE = ExchangeEnum.OANDA;
	MARKET = MarketEnum.INDICES;

	constructor(DataManager: DataManager) {
		super(DataManager);
	}

	fetchSymbolsList(): string[] {
		return [
			'US30_USD',
			'HK33_HKD',
			'JP225_USD',
			'SPX500_USD',
			'UK100_GBP',
			'DE10YB_EUR',
			'UK10YB_GBP',
			'IN50_USD',
			'USB10Y_USD',
			'USB05Y_USD',
			'US2000_USD',
			'USB02Y_USD',
			'DE30_EUR',
			'CN50_USD',
			'AU200_AUD',
			'NL25_EUR',
			'EU50_EUR',
			'USB30Y_USD',
			'NAS100_USD',
			'TWIX_USD',
			'SG30_SGD',
		];
	}

	fetchSymbolCandles(symbol: string, timeframe: ITimeframe): Promise<ICandlesticks[]> {
		const from = moment().subtract(1, 'day').unix();
		const to = moment().unix();
		const res = OandaHelper.getResolutionByTimeframe(timeframe);
		const url = `https://finnhub.io/api/v1/forex/candle?symbol=OANDA:${symbol}&resolution=${res}&from=${from}&to=${to}&token=${OandaHelper.FINNHUB_KEY}`;

		return new Promise((resolve, reject) => {
			axios
				.get(url)
				.then((result) => {
					console.log('TEST: result = ' + result);
					const candles: ICandlesticks[] = [{ close: 5000, high: 5000, low: 5000, timestamp: 50104, open: 5000 }];
					resolve(candles);
				})
				.catch((error) => reject(error));
		});
	}

	initialize() {}
}
