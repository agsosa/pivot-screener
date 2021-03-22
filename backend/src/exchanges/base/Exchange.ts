import ExchangeEnum from './ExchangeEnum';
import MarketEnum from './MarketEnum';
import DataManager from './../../data/DataManager';
import ICandlesticks from '../../data/ICandlesticks';

export const timeframes = [
	{ interval: '1d', name: 'daily', limit: 2 },
	{ interval: '1w', name: 'weekly', limit: 2 },
	{ interval: '1M', name: 'monthly', limit: 2 },
];

export default abstract class Exchange {
	initialized: boolean = false;
	dataManager: DataManager;
	fetchDataInterval: number = 30; // Seconds between each UpdateLoop()

	abstract readonly MARKET: MarketEnum;
	abstract readonly EXCHANGE: ExchangeEnum;
	abstract fetchSymbolsList(): Promise<string[]>;
	abstract fetchSymbolCandles(symbol: string, timeframe: string, interval: string, limit: number): Promise<ICandlesticks[]>; // Fetch the candlesticks for a symbol by timeframe
	abstract initialize(): any; // customize fetchDataInterval and exchange api specific initialization

	constructor(dataManager: DataManager) {
		this.dataManager = dataManager;
		this.UpdateLoop();
	}

	private async updateCandlesticks(): Promise<void> {
		const promises: Promise<void>[] = [];

		const tickersList = this.dataManager.getTickersListByMarketExchange(this.MARKET, this.EXCHANGE);

		for (const tickerObj of tickersList) {
			// For every timeframe grab candlesticks for each ticker
			timeframes.forEach((t) => {
				promises.push(
					this.fetchSymbolCandles(tickerObj.symbol, t.name, t.interval, t.limit).then((candles) => {
						this.dataManager.updateCandlesticks(tickerObj, t.name, candles);
					})
				);
			});
		}

		await Promise.all(promises);

		this.dataManager.emitUpdateEvent();
	}

	UpdateLoop(): void {
		if (this.initialized) {
			this.updateCandlesticks().then(() => {
				setTimeout(() => {
					this.UpdateLoop();
				}, 1000 * this.fetchDataInterval);
			});
		} else {
			this.fetchSymbolsList()
				.then((symbols) => {
					symbols.map((q) => !q.includes('_') && this.dataManager.addTicker({ symbol: q, market: this.MARKET, exchange: this.EXCHANGE, candlesticks: {} }));
					this.initialize();
					this.initialized = true;
					this.UpdateLoop();
				})
				.catch((error) => console.log(this.MARKET, this.EXCHANGE, ' fetchTickersList() error: ' + error));
		}
	}
}
