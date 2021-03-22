import ExchangeEnum from './ExchangeEnum';
import MarketEnum from './MarketEnum';
import DataManager from './../../data/DataManager';
import ICandlesticks from '../../data/ICandlesticks';

export interface ITimeframe {
	string: string;
	limit: number;
}

export const timeframes: ITimeframe[] = [
	{ string: 'daily', limit: 2 },
	{ string: 'weekly', limit: 2 },
	{ string: 'monthly', limit: 2 },
];

export default abstract class Exchange {
	initialized: boolean = false;
	dataManager: DataManager;
	fetchDataInterval: number = 30; // Seconds between each UpdateLoop()

	abstract readonly MARKET: MarketEnum;
	abstract readonly EXCHANGE: ExchangeEnum;
	abstract fetchSymbolsList(): Promise<string[]> | string[];
	abstract fetchSymbolCandles(symbol: string, timeframe: ITimeframe): Promise<ICandlesticks[]>; // Fetch the candlesticks for a symbol by timeframe
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
					this.fetchSymbolCandles(tickerObj.symbol, t).then((candles) => {
						this.dataManager.updateCandlesticks(tickerObj, t.string, candles);
					})
				);
			});
		}

		await Promise.all(promises);

		this.dataManager.emitUpdateEvent();
	}

	async UpdateLoop(): Promise<void> {
		if (this.initialized) {
			await this.updateCandlesticks();
			setTimeout(() => {
				this.UpdateLoop();
			}, 1000 * this.fetchDataInterval);
		} else {
			try {
				const symbols = await this.fetchSymbolsList();
				symbols.map((q) => !q.includes('_') && this.dataManager.addTicker({ symbol: q, market: this.MARKET, exchange: this.EXCHANGE, candlesticks: {} }));
				this.initialize();
				this.initialized = true;
				this.UpdateLoop();
			} catch (error) {
				console.log(this.MARKET, this.EXCHANGE, ' fetchTickersList() error: ' + error);
			}
		}
	}
}
