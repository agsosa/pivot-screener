import React, { createRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles((theme) => ({
  widgetContainer: {
    size: 'auto',
  },
}));

// Symbols to be shown on the widget
const symbols = [
  {
    proName: 'FOREXCOM:SPXUSD',
    title: 'S&P 500',
  },
  {
    proName: 'FOREXCOM:NSXUSD',
    title: 'Nasdaq 100',
  },
  {
    proName: 'FX_IDC:EURUSD',
    title: 'EUR/USD',
  },
  {
    description: 'BTC/USDT',
    proName: 'BINANCE:BTCUSDT',
  },
  {
    description: 'ETH/USDT',
    proName: 'BINANCE:ETHUSDT',
  },
  {
    description: 'GOLD',
    proName: 'OANDA:XAUUSD',
  },
  {
    description: 'SILVER',
    proName: 'OANDA:XAGUSD',
  },
];

// Options to pass to TV wdiget
const widgetOptions = {
  symbols,
  colorTheme: 'dark',
  isTransparent: true,
  showSymbolLogo: true,
  locale: 'en',
};

function TVWidget() {
  const [scriptMounted, setScriptMounted] = useState(false);
  const classes = useStyles();
  const hRef = createRef();

  useEffect(() => {
    // TV Widget
    if (!scriptMounted && hRef.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js';
      script.async = true;
      script.innerHTML = JSON.stringify(widgetOptions);

      hRef.current.appendChild(script);
      setScriptMounted(true);
    }
  }, [hRef]);

  return (
    <div className={classes.widgetContainer}>
      <div className='tradingview-widget-container' ref={hRef}>
        <div className='tradingview-widget-container__widget' />
      </div>
    </div>
  );
}

export default function TradingViewPrices({ responsive }) {
  if (responsive)
    return (
      <Hidden smDown>
        <TVWidget />
      </Hidden>
    );
  else return <TVWidget />;
}
