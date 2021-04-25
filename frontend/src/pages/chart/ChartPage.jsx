import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Spin, Button, Space, message, AutoComplete } from 'antd';
import Chart from 'pages/chart/Chart';
import { useMst } from 'models/Root';
import { apiFetchBinanceFuturesList, apiFetchBinanceFuturesCandles } from 'lib/API';
import ContentContainer from 'components/layout/ContentContainer';
import './ChartPage.css';
import ChartOptionsMenu from 'pages/chart/ChartOptionsMenu';
import { useIsMounted } from 'lib/Helpers';

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
    const result = await apiFetchBinanceFuturesCandles(symbol);
    if (symbol === result.symbol && isMounted())
      setTickers([{ symbol, market: '', exchange: '', candlesticks: result.candlesticks }]);
  }

  function startFetchCandles() {
    if (fetchCandlesTimeout.current) clearInterval(fetchCandlesTimeout.current);

    if (!firstLoad.current) {
      fetchCandles();
      fetchCandlesTimeout.current = setInterval(() => fetchCandles(), FETCH_INTERVAL);
    } else fetchCandles();
  }

  async function fetchSymbolsList() {
    let result = await apiFetchBinanceFuturesList();
    if (result && Array.isArray(result)) {
      result = result.map((q) => ({ value: q }));
      setSymbolsList(result);
    }
  }

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

  return (
    <ContentContainer breadcrumbItems={['Home', 'Chart']}>
      <Space direction='vertical' className='space'>
        <Space direction='vertical'>
          <h2> CPR + Camarilla Pivots Chart</h2>
          Displaying the latest 500 hours only. The data is updated automatically.
        </Space>
        <Space>
          <AutoComplete
            className='autocomplete'
            options={symbolsList}
            value={symbolInput}
            placeholder='BTCUSDT'
            onChange={(value) => setSymbolInput(value)}
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
      <Chart />
    </ContentContainer>
  );
});

export default ChartPage;
