import ExchangeEnum from './ExchangeEnum';
import MarketEnum from './MarketEnum';
import DataManager from './../../data/DataManager';

export default abstract class Exchange {
	initialized: boolean = false;
	dataManager: DataManager;
	fetchDataInterval: number = 30; // Seconds
	timeframes = [
		{ interval: '1d', name: 'daily', limit: 2 },
		{ interval: '1w', name: 'weekly', limit: 2 },
		{ interval: '1M', name: 'monthly', limit: 2 },
	];

	abstract MARKET: MarketEnum;
	abstract EXCHANGE: ExchangeEnum;

	abstract fetchTickersList(): Promise<void>;
	abstract fetchTickersData(): Promise<void>;
	abstract initialize(): Promise<void>;

	constructor(dataManager: DataManager) {
		this.dataManager = dataManager;
		this.UpdateLoop();
	}

	UpdateLoop(): void {
		if (this.initialized) {
			this.fetchTickersData().then(() => {
				setTimeout(() => {
					this.UpdateLoop();
				}, 1000 * this.fetchDataInterval);
			});
		} else {
			this.initialize().then(() => {
				this.initialized = true;
				this.UpdateLoop();
			});
		}
	}
}
