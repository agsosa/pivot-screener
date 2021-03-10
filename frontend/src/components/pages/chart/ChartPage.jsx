import React, { useEffect, useState, useRef, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Spin, Button, Space, message, AutoComplete } from 'antd';
import Chart from './Chart';
import { useMst } from '../../../models/Root';
import { apiFetchSymbolsList, apiFetchBinanceCandlesticksLocally } from '../../../lib/API';
import ContentContainer from '../../layout/ContentContainer';
import './ChartPage.css';
import ChartOptionsMenu from './ChartOptionsMenu';
import { useIsMounted } from '../../../lib/Helpers';

const FETCH_INTERVAL = 1000 * 15;

const ChartPage = observer(() => {
	const isMounted = useIsMounted();
	const [symbolInput, setSymbolInput] = useState('');
	const [symbol, setSymbol] = useState('BTCUSDT');
	const [symbolsList, setSymbolsList] = useState([]);

	const fetchCandlesTimeout = useRef(null);
	const firstLoad = useRef(true);

	const { tickers, setTickers } = useMst((store) => ({
		tickers: store.tickers,
		setTickers: store.setTickers,
	}));

	async function fetchCandles() {
		const result = await apiFetchBinanceCandlesticksLocally(symbol);
		if (symbol === result.symbol && isMounted()) setTickers([{ symbol, market: '', exchange: '', candlesticks: result.candlesticks }]);
	}

	function startFetchCandles() {
		if (fetchCandlesTimeout.current) clearInterval(fetchCandlesTimeout.current);

		if (!firstLoad.current) {
			fetchCandles();
			fetchCandlesTimeout.current = setInterval(() => fetchCandles(), FETCH_INTERVAL);
		} else fetchCandles();
	}

	async function fetchSymbolsList() {
		let result = await apiFetchSymbolsList();
		if (result && Array.isArray(result)) {
			result = result.map((q) => ({ value: q }));
			setSymbolsList(result);
		}
	}

	function onChartLoadComplete() {}

	useEffect(() => {
		startFetchCandles();
		firstLoad.current = false;
	}, [symbol]);

	useEffect(() => {
		fetchSymbolsList();
		startFetchCandles();

		return () => {
			if (fetchCandlesTimeout.current) clearInterval(fetchCandlesTimeout.current);
			setTickers([]);
		};
	}, []);

	function onChangeSymbolClick() {
		const input = symbolInput.toUpperCase();

		if (symbolsList.filter((q) => q.value === input).length !== 0) {
			setSymbol(input);
			message.loading('Loading symbol data...', 2);
		} else message.error('Symbol name not found');
	}

	const onAutoCompleteInputChange = useCallback((value) => {
		setSymbolInput(value);
	}, []);

	return (
		<ContentContainer breadcrumbItems={['Home', 'Chart']}>
			<Space>
				<h2> CPR + Camarilla Pivots Chart</h2>
			</Space>
			<br />
			Displaying the latest 500 hours only. The data is updated automatically.
			<br />
			<Space direction='vertical' className='space'>
				<Space>
					<AutoComplete
						className='autocomplete'
						options={symbolsList}
						value={symbolInput}
						placeholder='BTCUSDT'
						onChange={(value) => onAutoCompleteInputChange(value)}
						filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
					/>
					<Button type='primary' onClick={() => onChangeSymbolClick()}>
						Change Symbol
					</Button>
				</Space>

				{!tickers ||
					(tickers.length === 0 ? (
						<div className='loading-container'>
							<Spin tip='Loading Chart...' />
						</div>
					) : (
						<ChartOptionsMenu />
					))}
			</Space>
			<Chart onLoadComplete={onChartLoadComplete} symbol={symbol} />
		</ContentContainer>
	);
});

export default ChartPage;
