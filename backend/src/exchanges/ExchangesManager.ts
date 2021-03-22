import DataManager from '../data/DataManager';
import Exchange from './base/Exchange';
import BinanceFutures from './binance/BinanceFutures';

let exchanges: Exchange[] = [];

export function InitializeExchanges(dataManager: DataManager) {
	exchanges.push(new BinanceFutures(dataManager));
}
