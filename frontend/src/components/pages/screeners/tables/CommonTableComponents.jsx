import React from 'react';
import { Spin } from 'antd';
import { getPairObject } from '../../../../lib/Helpers';

export const symbolRenderer = (params) => {
	const { data, value } = params;
	const pair = getPairObject(value);
	const tv = data.tradingViewTicker;
	return `<a href="https://www.tradingview.com/chart?symbol=${tv}" target="_blank" class="external"><font size=3 color='black'>${pair.primary}</font> <font color='gray'>${pair.secondary}</font></a>`;
};

export const exchangeRenderer = (params) => {
	const { data, value } = params;
	let url;
	switch (data.exchange) {
		case 'Binance Futures':
			url = `https://www.binance.com/en/futures/${data.symbol}`;
			break;
		default:
			url = '';
			break;
	}
	return url ? `<a href=${url} target="_blank" class="external">${value}</a>` : value;
};

export const CustomLoadingOverlay = () => <Spin tip='Loading...' />;
