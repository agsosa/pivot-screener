var events = require('events');
var eventEmitter = new events.EventEmitter();

const data = {
    isReady: false,
    tickersList: [], // { ticker: str, market: marketstr, candlesticks: { dailyCandles, weeklyCandles, monthlyCandles, hourlyCandles, etc.}}
}

function setReady() {
    data.isReady = true;
}

function addTicker(tickerObj) {  //{ ticker: str, market: <market str>} // Available markets: "crypto_binancefut"
    if (!data.tickersList.find(q => q.symbol == tickerObj.symbol && q.market == tickerObj.market)) data.tickersList.push(tickerObj);
}

function updateTickerCandlesticks(tickerObj, candlesticksObj) {
    //let obj = tickersList.find(q => q.ticker == tickerObj.ticker && q.market == tickerObj.market);
    tickerObj.candlesticks = candlesticksObj;

    /*if (tickerObj.ticker == "BTCUSDT") {
        console.log("received btcusdt");
        eventEmitter.emit('scream');
    }*/
}

exports.data = data;
exports.eventEmitter = eventEmitter
exports.addTicker = addTicker;
exports.updateTickerCandlesticks = updateTickerCandlesticks;
exports.setReady = setReady;