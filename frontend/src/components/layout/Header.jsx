import React, { createRef, useEffect, useState } from 'react';
import { Alert, Col, Row } from 'antd';
import './Header.css';
import DailyCloseTime from '../DailyCloseTime';

export default function LayoutHeader() {
	const [scriptMounted, setScriptMounted] = useState(false);

	const hRef = createRef();

	useEffect(() => {
		// TV Widget
		if (!scriptMounted) {
			const script = document.createElement('script');
			script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js';
			script.async = true;
			script.innerHTML = JSON.stringify({
				symbols: [
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
				],
				colorTheme: 'dark',
				isTransparent: true,
				showSymbolLogo: true,
				locale: 'en',
			});

			hRef.current.appendChild(script);
			setScriptMounted(true);
		}
	}, [hRef]);

	return (
		<>
			<div className='header-title'>
				<div className='widget_container'>
					<div className='tradingview-widget-container' ref={hRef}>
						<div className='tradingview-widget-container__widget' />
					</div>
				</div>

				<Row>
					<Col span={8} className='left-col'>
						<div>
							<DailyCloseTime />
						</div>
					</Col>
					<Col span={8} className='center-col'>
						<a href='/' className='header-link'>
							Pivot Screener <sup>Beta</sup>
						</a>
					</Col>
				</Row>
			</div>

			<div className='promoContainer'>
				<Alert
					message={
						<>
							<b>Camarilla Pivot Trading Telegram</b> •
							<a href='https://t.me/camarillacruisin' target='_blank' rel='noopener noreferrer'>
								<b>Click here to join the group!</b>
							</a>
						</>
					}
					type='warning'
				/>
			</div>
		</>
	);
}
