import DataManager from 'data/DataManager';
import Exchange from 'exchanges/Exchange';
import BinanceFutures from 'exchanges/binance/BinanceFutures';
import OandaIndices from 'exchanges/oanda/OandaIndices';
import OandaForex from 'exchanges/oanda/OandaForex';
import OandaCommodities from 'exchanges/oanda/OandaCommodities';

let exchanges: Exchange[] = [];

export function InitializeExchanges(dataManager: DataManager) {
  exchanges.push(new BinanceFutures(dataManager));
  /*exchanges.push(new OandaIndices(dataManager));
  exchanges.push(new OandaForex(dataManager));
  exchanges.push(new OandaCommodities(dataManager));*/
}
