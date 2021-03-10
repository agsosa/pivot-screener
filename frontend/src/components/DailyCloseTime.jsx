import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './DailyCloseTime.css';

export default function DailyCloseTime() {
	const getDailyClose = (exchange = 'binance') => {
		let time;

		switch (exchange) {
			case 'binance':
				time = moment();
				break;
			case 'huobi':
				time = moment().utcOffset(5);
				break;
			default:
				time = undefined;
		}

		if (time) {
			const now = moment();
			const dif = time.endOf('day').diff(now);

			return moment(dif).format('HH:mm:ss');
		}

		return '...';
	};

	const [binanceTimeleft, setBinanceTimeleft] = useState(getDailyClose('binance'));
	const [huobiTimeleft, SetHuobiTimeleft] = useState(getDailyClose('huobi'));

	useEffect(() => {
		const timer = setTimeout(() => {
			setBinanceTimeleft(getDailyClose('binance'));
			SetHuobiTimeleft(getDailyClose('huobi'));
		}, 1000);
		return () => clearTimeout(timer);
	});

	return (
		<div className='container'>
			<div>Binance Daily Close: {binanceTimeleft.toString()}</div>
			<div>Huobi Daily Close: {huobiTimeleft.toString()}</div>
		</div>
	);
}
