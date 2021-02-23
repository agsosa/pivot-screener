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

function getSymbolsList(markets = undefined) {
    let result = [];

    data.tickersList.map(q => {
        if (!markets) {
            result.push(q.symbol);
        }
        else {
            markets = markets.replace(/\s/g, "").split(",");
            bMarkets = markets && Array.isArray(markets);
            if (bMarkets) {
                markets = markets.map(q => { return q.toLowerCase() });
            
                if (markets.includes(q.market)) result.push(q.symbol);
            }
        }
    })

    return result;
}

// TODO: Implementar guardado de historial y fetch inteligente de velas. X ej que no fechee las velas de 1h a cada rato sino cada menos tiempo, aprovechar el ticker model views, solo se van necesitando nuevas velas y lo demas mantener actualizado 1 candlestick para saber si se testeo el cpr o no
/*
SEPARAR HOURLYCANDLES DE DAILY-WEEKLY-MONTHLY y actualizarlas mas lento
>>>>>>>>o QUIZAS USAR AL CLIENTE PARA SACAR LAS HOURLYCANDLES


IDEA DESCARTADA
1) tomar el symbol list
2) para cada symbol tomar velas historicas, colocar timestamp
3) mantener un intervalo de 1 seg esperando cierta diferencia entre date.now y timestamp
4) cuando se cumpla ese intervalo (x ej 1h, 24h) intentar refrezcar velas historicas

refreshCandlesticks
refreshCurrentOHLC

mantener un OHLC actual apartado de candlesticks actualizandose con All Market Mini Tickers Stream
(y un canal de websockets para enviar esto tmb)
*/
function getFilteredTickers(timeframes, markets, symbols) {
    try {
        if (symbols) symbols = symbols.replace(/\s/g, "").split(",");
        if (markets) markets = markets.replace(/\s/g, "").split(",");
        if (timeframes) timeframes = timeframes.replace(/\s/g, "").split(",");

        bSymbols = symbols && Array.isArray(symbols);
        bMarkets = markets && Array.isArray(markets);
        bTimeframes = timeframes && Array.isArray(timeframes);

        if (bSymbols) symbols = symbols.map(q => { return q.toLowerCase() });
        if (bMarkets) markets = markets.map(q => { return q.toLowerCase() });
        if (bTimeframes) timeframes = timeframes.map(q => { return q.toLowerCase() });

        let filtered = JSON.parse(JSON.stringify(data.tickersList));

        // Filter by tickers and markets parameter
        if (bSymbols) filtered = filtered.filter(q => symbols.includes(q.symbol.toLowerCase()));
        if (bMarkets) filtered =  filtered.filter(q =>  markets.includes(q.market.toLowerCase()));

        // Remove unwanted timeframes
        if (bTimeframes) {
            filtered.forEach(item => {
                for (const k of Object.keys(item.candlesticks)) {
                    if (!timeframes.find(t => t+"Candles" == k)) delete item.candlesticks[k];
                }
            });
        }

        return filtered;
    }
    catch {
        return [];
    }
}

function emitDataUpdatedEvent() {
    eventEmitter.emit('data_updated');
}

exports.data = data;
exports.eventEmitter = eventEmitter
exports.addTicker = addTicker;
exports.getTickersListByMarketExchange = getTickersListByMarketExchange;
exports.emitDataUpdatedEvent = emitDataUpdatedEvent;
exports.getFilteredTickers = getFilteredTickers;
exports.getSymbolsList = getSymbolsList;