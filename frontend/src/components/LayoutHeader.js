import { useRef, useEffect, createRef } from 'react';
import { Layout } from 'antd';
import './LayoutHeader.css';

const { Header } = Layout;

export default function LayoutHeader(props) {
    const hRef = createRef();

    useEffect(() => {
        console.log("onMount")
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js'
        script.async = true;
        script.innerHTML = JSON.stringify(  {
        "symbols": [
            {
            "proName": "FOREXCOM:SPXUSD",
            "title": "S&P 500"
            },
            {
            "proName": "FOREXCOM:NSXUSD",
            "title": "Nasdaq 100"
            },
            {
            "proName": "FX_IDC:EURUSD",
            "title": "EUR/USD"
            },
            {
            "description": "BTC/USDT",
            "proName": "BINANCE:BTCUSDT"
            },
            {
            "description": "ETH/USDT",
            "proName": "BINANCE:ETHUSDT"
            },
            {
            "description": "GOLD",
            "proName": "OANDA:XAUUSD"
            },
            {
            "description": "SILVER",
            "proName": "OANDA:XAGUSD"
            }
        ],
        "colorTheme": "dark",
        "isTransparent": false,
        "showSymbolLogo": true,
        "locale": "en"
        });

        //document.body.appendChild(script);
        hRef.current.appendChild(script);

        return () => {

        }

    }, [hRef]);

    return (
        <>
            <div class="widget_container">
                <div class="tradingview-widget-container" ref={hRef}><div class="tradingview-widget-container__widget"></div></div>
            </div> 

            <div className="header-title" style={{padding: 14}}><a href="/" style={{color:'white'}}>Pivot Screener</a></div>
        </>
    )
}