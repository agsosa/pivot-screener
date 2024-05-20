import { types } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { persist } from 'mst-persist';
import { io } from 'socket.io-client';
import Ticker from 'models/Ticker';
import { calcPercent, isDev } from 'lib/Helpers';
import ChartOptions from 'models/ChartOptions';
import BinanceFutures from 'lib/node/BinanceFutures';

// TODO: Move socket logic to /lib/API

const SOCKET_URL = isDev() ? 'http://localhost:4001' : 'https://api.pivotscreener.com/';

const RootModel = types
  .model('RootModel', {
    tickers: types.array(Ticker),
    cprStatsPanelVisible: true,
    camStatsPanelVisible: true,
    symbolsList: types.array(types.string),
    socketConnected: false,
    chartOptions: ChartOptions,
    camTableFilters: types.optional(types.frozen()),
    cprTableFilters: types.optional(types.frozen()),
  })
  .actions((self) => {
    let socket;
    let currentQuery = null;

    async function test2() {

    }

     const timeframes = [
      { string: 'daily', limit: 2 },
      { string: 'weekly', limit: 2 },
      { string: 'monthly', limit: 2 },
    ];

    async function test() {
      const promises = [];
      
      const instance = new BinanceFutures();

      console.log("initializing binance")

       instance.initialize();

      console.log("fetching symbols list")
      const symbols = await instance.fetchSymbolsList();
      
      console.log("received symbols", symbols)

      for (const tickerObj of symbols) {
        console.log("loop for", tickerObj)
        // For every timeframe grab candlesticks for each ticker

        timeframes.forEach((t) => {
          console.log("hello")
          promises.push(
            instance.fetchSymbolCandles(tickerObj, t).then((candles) => {
              console.log(candles)
            })
          );
        });
      }

      console.log("waiting promises")

      await Promise.all(promises);

      // data updated

      console.log("my result",result)
      self.setTickers(result);
      test2();
    }


    function afterCreate() {
      console.log("afterCreate")

      test();

     /* socket = io(SOCKET_URL, {
        transports: ['websocket'],
        upgrade: true,
        autoConnect: false,
      });

      socket.on('connect', () => {
        self.setSocketConnected(true);
        console.log(currentQuery," curr")
        if (currentQuery != null) socket.emit('request_tickers', JSON.stringify(currentQuery)); // request_tickers with the pending currentQuery
      });

      socket.on('disconnect', () => {
        self.setSocketConnected(false);
      });

      socket.on('connect_error', (err) => {
        console.log(`Socket error: ${err}`);
      });

      socket.on('tickers_data', (data) => {
        self.setTickers(data);
      });*/
    }

    function beforeDestroy() {
      currentQuery = null;
      socket.close();
      socket = null;
    }

    const startReceivingData = (timeframes = undefined, markets = undefined, symbols = undefined) => {
      if (socket && !socket.connected) socket.connect();

      currentQuery = { timeframes, markets, symbols }; // Used on reconnection

      console.log("currentQuery", currentQuery)

      if (socket) {
        socket.emit('request_tickers', JSON.stringify(currentQuery));
      }
    };

    const stopReceivingData = () => {
      currentQuery = null;
      socket.close();
    };

    function setTickers(data) {
      self.tickers = data.map((q) => ({
        ...q,
        symbol: q.symbol.replace('_', ''),
      }));
    }

    function setSocketConnected(b) {
      self.socketConnected = b;
    }

    const toggleCPRStatsPanel = () => {
      self.cprStatsPanelVisible = !self.cprStatsPanelVisible;
    };

    const toggleCamStatsPanel = () => {
      self.camStatsPanelVisible = !self.camStatsPanelVisible;
    };

    const setCamTableFilters = (filters) => {
      self.camTableFilters = filters;
    };

    const setCprTableFilters = (filters) => {
      self.cprTableFilters = filters;
    };

    return {
      afterCreate,
      beforeDestroy,
      toggleCPRStatsPanel,
      startReceivingData,
      stopReceivingData,
      setTickers,
      setSocketConnected,
      toggleCamStatsPanel,
      setCamTableFilters,
      setCprTableFilters,
    };
  })
  .views((self) => ({
    cprStats(timeframe, futureMode = false) {
      const result = {
        aboveCount: 0,
        belowCount: 0,
        neutralCount: 0,
        untestedCount: 0,
        bullsPercent: 0,
        bearsPercent: 0,
        wideCount: 0,
        tightCount: 0,
      };

      self.tickers.forEach((q) => {
        const cpr = q.getCPR(timeframe, futureMode);

        result.aboveCount += cpr.price_position === 'above' ? 1 : 0;
        result.belowCount += cpr.price_position === 'below' ? 1 : 0;
        result.neutralCount += cpr.price_position === 'neutral' ? 1 : 0;

        result.wideCount += cpr.width > 1 ? 1 : 0;
        result.tightCount += cpr.width <= 1 ? 1 : 0;

        // isTested will be undefined for new pairs with only 1 candle and should count this case as tested, otherwise just return isTested value.
        result.untestedCount += (cpr.isTested === undefined ? true : cpr.isTested) ? 0 : 1;
      });

      // Neutrals are ignored in bulls/bears percentage
      result.bullsPercent = calcPercent(result.aboveCount, result.aboveCount + result.belowCount);
      result.bearsPercent = calcPercent(result.belowCount, result.aboveCount + result.belowCount);

      return result;
    },
    camStats(timeframe, futureMode = false) {
      const result = {
        aboveH4: 0,
        belowL4: 0,
        aboveH3: 0,
        belowL3: 0,
        betweenL3H3: 0,
        bullsPercent: 0,
        bearsPercent: 0,
      };
      self.tickers.forEach((q) => {
        const cam = q.getCamarilla(timeframe, futureMode);

        switch (cam.situation) {
          case 'Above H4':
            result.aboveH4 += 1;
            break;
          case 'Above H3':
            result.aboveH3 += 1;
            break;
          case 'Below L3':
            result.belowL3 += 1;
            break;
          case 'Below L4':
            result.belowL4 += 1;
            break;
          default:
            result.betweenL3H3 += 1;
        }
      });

      const a = self.tickers.length - result.betweenL3H3;
      result.bullsPercent = calcPercent(result.aboveH4 + result.aboveH3, a === 0 ? self.tickers.length : a);
      result.bearsPercent = calcPercent(result.belowL4 + result.belowL3, a === 0 ? self.tickers.length : a);

      return result;
    },
  }));

const initialState = RootModel.create({
  cprStatsPanelVisible: true,
  camStatsPanelVisible: true,
  chartOptions: {
    dailyCPR: true,
    weeklyCPR: true,
    monthlyCPR: true,
    dailyCam: false,
    weeklyCam: false,
    monthlyCam: true,
    futureMode: false,
  },
});

persist('PivotSC', initialState, {
  whitelist: ['cprStatsPanelVisible', 'camStatsPanelVisible', 'chartOptions', 'cprTableFilters', 'camTableFilters'],
});

export const rootStore = initialState;
const MSTContext = createContext(null);
// eslint-disable-next-line prefer-destructuring
export const Provider = MSTContext.Provider;

export function useMst(mapStateToProps) {
  const store = useContext(MSTContext);

  if (typeof mapStateToProps !== 'undefined') {
    return mapStateToProps(store);
  }

  return store;
}
