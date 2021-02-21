const express = require('express');
const bodyParser = require('body-parser');
const datamanager = require('./datamanager');
const cors = require('cors');
var compression = require('compression')
var jsonpack = require('jsonpack/main')
const { validate, ValidationError, Joi } = require('express-validation')

require('./binance_futures');

const app = express();
const port = 4000;

// Validations
const candlesticksValidation = {
    query: Joi.object({
        symbols: Joi.string().optional(),
        markets: Joi.string().optional(),
        timeframes: Joi.string().optional(),
    }),
}

// Middlewares
app.use(compression())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('*', (req, res, next) => {
    if (!datamanager.data.isReady) {
        const error = new Error('Not ready');
        error.status = 404;
        next(error);
    }
    else next();
});

// Endpoints
app.get('/', (req, res) => {
    res.send('OK');
});

// /api/candlesticks. Query parameters acepted: tickers, markets, timeframes (daily, monthly, weekly, hourly).
// TODO: Mejorar documentacion de la API
app.get('/api/candlesticks', validate(candlesticksValidation, {}, {}), (req, res, next) => {
    try {
        let { symbols, markets, timeframes } = req.query;

        if (symbols) symbols = symbols.split(",");
        if (markets) markets = markets.split(",");
        if (timeframes) timeframes = timeframes.split(",");

        bSymbols = symbols && Array.isArray(symbols);
        bMarkets = markets && Array.isArray(markets);
        bTimeframes = timeframes && Array.isArray(timeframes);

        bSymbols && symbols.map(q => q.toLowerCase());
        bMarkets && markets.map(q => q.toLowerCase());
        bTimeframes && timeframes.map(q => q.toLowerCase());

        let filtered = JSON.parse(JSON.stringify(datamanager.data.tickersList));

        // Filter by tickers and markets parameter
        filtered = filtered.filter(q => (bSymbols ? symbols.includes(q.symbol.toLowerCase()) : true) && (bMarkets ? markets.includes(q.market.toLowerCase()) : true))

        // Remove unwanted timeframes
        if (bTimeframes) {
            filtered.forEach(item => {
                for (const k of Object.keys(item.candlesticks)) {
                    if (!timeframes.find(t => t+"Candles" == k)) delete item.candlesticks[k];
                }
            });
        }
    
        res.send(jsonpack.pack(filtered));
    }
    catch (e) {
        const error = new Error(e.toString());
        error.msg = e.toString();
        error.status = 404;
        //res.send(error.toString());
        next(error);
    }
});

// server-sent event stream
/*app.get('/events', function (req, res) {
    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
      });
    res.flushHeaders();

    res.write('retry: 5000\n\n');
  
    // send a ping approx every 2 seconds
    /*var timer = setInterval(function () {
      res.write('data: ping\n\n')
  
      res.flush()
    }, 2000)*/
  
    /*let myEventHandler = function () {
        res.write('data: ping\n\n')
  
        res.flush()
    }

    datamanager.eventEmitter.on('scream', myEventHandler);
    
    res.on('close', function () {
      //clearInterval(timer)
      datamanager.eventEmitter.removeListener('scream', myEventHandler);
    })
})*/

app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err)
    }
  
    return res.status(500).json(err)
})

app.listen(port, () => console.log(`Backend listening on port ${port}`))