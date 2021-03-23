import DataManager from '../data/DataManager';
import Exchange from './base/Exchange';
import BinanceFutures from './binance/BinanceFutures';
import OandaIndices from './oanda/OandaIndices';
import OandaForex from './oanda/OandaForex';
import OandaCommodities from './oanda/OandaCommodities';

let exchanges: Exchange[] = [];

export function InitializeExchanges(dataManager: DataManager) {
	exchanges.push(new BinanceFutures(dataManager));
	exchanges.push(new OandaIndices(dataManager));
	exchanges.push(new OandaForex(dataManager));
	exchanges.push(new OandaCommodities(dataManager));
}
