var events = require('events');
var eventEmitter = new events.EventEmitter();

const data = {
    isReady: false,
    tickersList: [], // { ticker: str, market: str, exchange:str, candlesticks: { dailyCandles, weeklyCandles, monthlyCandles, hourlyCandles, etc.}}
}

function addTicker(tickerObj) {  //{ ticker: str, market: <market str>} // Available markets: "crypto_binancefut"
    if (!data.tickersList.find(q => q.symbol == tickerObj.symbol && q.market == tickerObj.market && q.exchange == tickerObj.exchange)) data.tickersList.push(tickerObj);
}

function getTickersListByMarketExchange(market, exchange) {
    return (data.tickersList.filter(q => q.market == market && q.exchange == exchange));
}

function emitDataUpdatedEvent() {
    eventEmitter.emit('data_updated');
}

exports.data = data;
exports.eventEmitter = eventEmitter
exports.addTicker = addTicker;
exports.getTickersListByMarketExchange = getTickersListByMarketExchange;
exports.emitDataUpdatedEvent = emitDataUpdatedEvent;