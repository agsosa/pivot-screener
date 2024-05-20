
export const timeframes = [
  { string: 'daily', limit: 2 },
  { string: 'weekly', limit: 2 },
  { string: 'monthly', limit: 2 },
];

export default  class Exchange {
  initialized = false;
  fetchDataInterval = 60; // Seconds between each UpdateLoop()

  constructor() {
    this.UpdateLoop();
  }

   async updateCandlesticks() {
    const promises = [];

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

    this.dataManager.emitUpdateEvent(this.MARKET);
  }

  async UpdateLoop() {
    if (this.initialized) {
      try {
        await this.updateCandlesticks();
        console.log(this.MARKET, this.EXCHANGE, ' updateCandlesticks() done.');
      } catch (error) {
        console.error(this.MARKET, this.EXCHANGE, ' updateCandlesticks() error: ' + error);
      } finally {
        setTimeout(() => {
          this.UpdateLoop();
        }, 1000 * this.fetchDataInterval);
      }
    } else {
      try {
        const symbols = await this.fetchSymbolsList();
        symbols.map((q) =>
          this.dataManager.addTicker({ symbol: q, market: this.MARKET, exchange: this.EXCHANGE, candlesticks: {} })
        );
        this.initialize();
        this.initialized = true;
        this.UpdateLoop();
      } catch (error) {
        console.log(this.MARKET, this.EXCHANGE, ' fetchTickersList() error: ' + error);
      }
    }
  }
}
