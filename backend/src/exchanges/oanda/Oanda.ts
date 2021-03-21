import Exchange from '../base/Exchange';
import DataManager from '../../data/DataManager';
import ExchangeEnum from '../base/ExchangeEnum';

//process.env.FINNHUB_KEY

const KEY = process.env.FINNHUB_KEY;

export default class OANDA extends Exchange {
	EXCHANGE = ExchangeEnum.OANDA;

	constructor(DataManager: DataManager) {
		super(DataManager);
		if (!KEY) console.error('[Oanda] No valid FINNHUB_KEY env variable was found');
	}
}
