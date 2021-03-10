import React, { useEffect, useState, useRef, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Spin, Button, Space, message, AutoComplete } from 'antd';
import Chart from './Chart';
import { useMst } from '../../../models/Root';
import { apiFetchSymbolsList, apiFetchBinanceCandlesticksLocally } from '../../../lib/API';
import ContentContainer from '../../layout/ContentContainer';

const SYMBOLS_LIST_FETCH_INTERVAL = 1000 * 15;

// TODO: Fix Chart.js rerendering on input

const ChartPage = observer(() => {
	const [symbolInput, setSymbolInput] = useState('');
	const [symbol, setSymbol] = useState('BTCUSDT');
	const [symbolsList, setSymbolsList] = useState([]);

	const fetchCandlesTimeout = useRef(null);
	const fetchSymbolsListTimeout = useRef(null);

	const { tickers, setTickers } = useMst((store) => ({
		tickers: store.tickers,
		setTickers: store.setTickers,
	}));

	async function fetchCandles() {
		const result = await apiFetchBinanceCandlesticksLocally(symbol);
		if (symbol === result.symbol) setTickers([{ symbol, market: '', exchange: '', candlesticks: result.candlesticks }]);
		fetchCandlesTimeout.current = setTimeout(() => {
			fetchCandles();
		}, SYMBOLS_LIST_FETCH_INTERVAL);
	}

	async function fetchSymbolsList() {
		let result = await apiFetchSymbolsList();
		if (result && Array.isArray(result)) {
			result = result.map((q) => ({ value: q }));
			setSymbolsList(result);
		}

		fetchSymbolsListTimeout.current = setTimeout(() => {
			fetchSymbolsList();
		}, SYMBOLS_LIST_FETCH_INTERVAL);
	}

	function onChartLoadComplete() {}

	function cancelFetchCandles() {
		if (fetchCandlesTimeout.current) {
			clearTimeout(fetchCandlesTimeout.current);
		}
	}

	function cancelFetchSymbolsList() {
		if (fetchSymbolsListTimeout.current) {
			clearTimeout(fetchSymbolsListTimeout.current);
		}
	}

	useEffect(() => {
		cancelFetchCandles();
		fetchCandles();
	}, [symbol]);

	useEffect(() => {
		fetchSymbolsList();

		return () => {
			cancelFetchCandles();
			cancelFetchSymbolsList();
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
			<Space direction='vertical' style={{ padding: 20 }}>
				<Space>
					<AutoComplete
						style={{ width: 200, marginBottom: 0 }}
						options={symbolsList}
						value={symbolInput}
						placeholder='BTCUSDT'
						onChange={(value) => onAutoCompleteInputChange(value)}
						filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
					/>{' '}
					<Button type='primary' onClick={() => onChangeSymbolClick()}>
						Change Symbol
					</Button>
				</Space>
			</Space>
			{!tickers ||
				(tickers.length === 0 && (
					<div style={{ textAlign: 'center', marginTop: 15 }}>
						{' '}
						<Spin tip='Loading Chart...' />
					</div>
				))}
			<br />
			<Chart onLoadComplete={onChartLoadComplete} symbol={symbol} />
		</ContentContainer>
	);
});

export default ChartPage;
