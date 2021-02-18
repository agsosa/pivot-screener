const express = require('express');
const bodyParser = require('body-parser');
const datamanager = require('./datamanager');
const cors = require('cors');
var compression = require('compression')
var jsonpack = require('jsonpack/main')
//const validateParams = require('./validateParams');
const { validate, ValidationError, Joi } = require('express-validation')

require('./binance_futures');

const app = express();
const port = 4000;

// Middlewares
app.use(compression())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('*', (req, res, next) => {
    if (!datamanager.data.isReady) {
        console.log("HERE HERE HERE");
        const error = new Error('Not ready');
        error.status = 404;
        res.send("Not ready");
        next(error);
    }
    else next();
});

// Endpoints
app.get('/', (req, res) => {
    res.send('OK');
});

const candlesticksValidation = {
    query: Joi.object({
        tickers: Joi.string().optional(),
        markets: Joi.string().optional(),
        timeframes: Joi.string().optional(),
    }),
}

app.get('/api/candlesticks', validate(candlesticksValidation, {}, {}), (req, res, next) => {
    try {
        
        let { tickers, markets, timeframes } = req.query;

        if (tickers) tickers = tickers.split(",");//JSON.parse(tickers.split(","));
        if (markets) markets = markets.split(",");//JSON.parse(markets.split(","));
        if (timeframes) timeframes = timeframes.split(",");//JSON.parse(timeframes.split(","));

        bTickers = tickers && Array.isArray(tickers);
        bMarkets = markets && Array.isArray(markets);
        bTimeframes = timeframes && Array.isArray(bTimeframes);

        bTickers && tickers.map(q => q.toLowerCase());
        bMarkets && markets.map(q => q.toLowerCase());
        bTimeframes && timeframes.map(q => q.toLowerCase());

        let filtered = [...datamanager.data.tickersList];
        filtered = filtered.filter(q => (bTickers ? tickers.includes(q.ticker.toLowerCase()) : true))

        if (bTimeframes)
//|| (bMarkets && markets.includes(q.market.toLowerCase()))



        // filter by markets
        //if (markets && Array.isArray(markets)) filtered = [...datamanager.tickersList.filter(q => markets.includes(q.market))]; 

        // filter by tickers
        //if (tickers && Array.isArray(tickers)) filtered = [...filtered.filter(q => tickers.includes(q.ticker))];

        // filter by timeframes
        /*let byTimeframes = timeframes.includes('all') ? [...byTickers] : [...byTickers.map(q => {
            Object.keys(q).forEach(k => {
                if (k.includes("candle") && !timeframes.find(t => t+"Candles" == k)) delete(q.key);
            })
        })]*/
    
        //res.send(jsonpack.pack(dataResult));
        res.json(filtered);
    }
    catch (e) {
        const error = new Error(e.toString());
        error.status = 404;
        res.send(error.toString());
        //next(error);
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