import events from 'events';
import ITicker from './ITicker';
import ICandlesticks from './ICandlesticks';

export default class DataManager {
	eventEmitter: events; // Used to subscribe other modules to data events (i.e. data updated event)

	private _tickersList: ITicker[];
	get tickersList(): ITicker[] {
		return this._tickersList;
	}

	constructor() {
		this.eventEmitter = new events.EventEmitter();
		this._tickersList = [];
	}

	addTicker(ticker: ITicker): void {
		if (!this._tickersList.find((q) => q.symbol === ticker.symbol && q.market === ticker.market && q.exchange === ticker.exchange)) this._tickersList.push(ticker);
	}

	updateCandlesticks(ticker: ITicker, timeframe: string, candlesticks: ICandlesticks[]): void {
		ticker.candlesticks[timeframe + 'Candles'] = candlesticks;
	}

	emitUpdateEvent(): void {
		// TODO: Refactor
		console.log('emitUpdateEvent signal, tickers length = ' + this._tickersList.length);
		this.eventEmitter.emit('data_updated');
	}

	getTickersListByMarketExchange(market: string, exchange: string): ITicker[] {
		return this._tickersList.filter((q) => q.market === market && q.exchange === exchange);
	}

	/*
		Returns a symbol name list (example: ["BTCUSDT", "ETHUSDT", "ADAUSDT"]), can filter by exchange (optional)
		Params:
			(optional) markets: string with comma separated markets, example: "cryptocurrency, stocks, forex" (MarketEnum)
		Return: string[] or []
	*/
	getSymbolsList(markets?: string): string[] {
		const result: string[] = [];

		this._tickersList.map((q) => {
			if (!markets) {
				// No market filter
				result.push(q.symbol);
			} else {
				// Market filter
				// Get array by comma separated string
				try {
					let split: string[] = markets.replace(/\s/g, '').split(',');
					const bMarkets: boolean = split != null && Array.isArray(split);
					if (bMarkets) {
						split = split.map((s) => s.toLowerCase());
						if (markets.includes(q.market)) result.push(q.symbol);
					}
				} catch (error) {
					// TODO: Handle error
					return [];
				}
			}
		});

		return result;
	}

	/*
		Returns a filtered ITickers list by timeframes, markets and symbols
		Params:
			timeframes, markets, symbols: comma-separated list
		Return: ITickers[] or []
	*/
	getFilteredTickers(timeframes: string, markets: string, symbols: string) {
		try {
			let arrSymbols: string[] = [];
			let arrMarkets: string[] = [];
			let arrTimeframes: string[] = [];

			// Convert coma-separated list to array
			if (symbols) arrSymbols = symbols.replace(/\s/g, '').split(',');
			if (markets) arrMarkets = markets.replace(/\s/g, '').split(',');
			if (timeframes) arrTimeframes = timeframes.replace(/\s/g, '').split(',');

			// Lower case all strings
			arrSymbols = arrSymbols.map((q) => q.toLowerCase());
			arrMarkets = arrMarkets.map((q) => q.toLowerCase());
			arrTimeframes = arrTimeframes.map((q) => q.toLowerCase());

			let filtered: ITicker[] = JSON.parse(JSON.stringify(this._tickersList)); // No tickersList mutation

			// Filter by tickers and markets parameter
			if (arrSymbols.length > 0) filtered = filtered.filter((q) => symbols.includes(q.symbol.toLowerCase()));
			if (arrMarkets.length > 0) filtered = filtered.filter((q) => markets.includes(q.market.toLowerCase()));

			// Remove unwanted timeframes
			if (arrTimeframes.length > 0) {
				filtered.forEach((item) => {
					Object.keys(item.candlesticks).forEach((k) => {
						if (!arrTimeframes.find((t) => `${t}Candles` === k)) delete item.candlesticks[k]; // Remove fields "<timeframe>Candles" from the ITicker object
					});
				});
			}

			return filtered;
		} catch {
			return [];
		}
	}
}
