import React, { createRef, useEffect, useState } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { Alert, Badge, Col, notification, Row } from 'antd';

import './LayoutHeader.css';
import DailyCloseTime from '../DailyCloseTime';

export default function LayoutHeader() {
	const [scriptMounted, setScriptMounted] = useState(false);

	const hRef = createRef();

	const openNotification = () => {
		notification.open({
			message: 'Error',
			description: 'This feature is under development',
			onClick: () => {},
		});
	};

	useEffect(() => {
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
			<div className='header-title' style={{}}>
				<div className='widget_container'>
					<div className='tradingview-widget-container' ref={hRef}>
						<div className='tradingview-widget-container__widget' />
					</div>
				</div>

				<Row>
					<Col span={8} style={{ marginTop: '1%', marginLeft: '1%', flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
						<div>
							<DailyCloseTime />
						</div>
					</Col>
					<Col
						span={8}
						style={{
							padding: 5,
							flex: 1,
							display: 'flex',
							justifyContent: 'center',
						}}>
						<a href='/' style={{ fontSize: 'XX-LARGE', color: 'white', marginTop: 10 }}>
							Pivot Screener <sup style={{ fontSize: 15 }}>Beta</sup>
						</a>
					</Col>
					<Col
						span={8}
						style={{
							padding: 15,
							flex: 1,
							display: 'flex',
							justifyContent: 'flex-end',
						}}>
						<div style={{ marginRight: '15%', marginTop: '1%' }} />

						<div style={{ marginRight: '2%' }}>
							<Badge
								count={5}
								dot
								offset={[-10, 10]}
								style={{
									width: 10,
									height: 10,
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									borderColor: 'red',
									borderRadius: 24,
									cursor: 'pointer',
									marginLeft: 8,
								}}>
								<BellOutlined onClick={openNotification} style={{ color: 'white', fontSize: 32 }} />
							</Badge>
						</div>
					</Col>
				</Row>
			</div>

			<div style={{ alignSelf: 'center', paddingTop: 15, paddingBottom: 10 }}>
				<Alert
					message={
						<>
							<b>Camarilla Pivot Trading Telegram</b> •{' '}
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
