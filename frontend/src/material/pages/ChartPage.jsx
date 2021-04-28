import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SymbolsListSelector from 'material/components/misc/SymbolsListSelector';
import ChartOptions from 'material/components/chart/ChartOptions';
import Chart from 'components/chart/Chart';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import { useMst } from 'models/Root';
import { apiFetchBinanceFuturesCandles } from 'lib/API';
import CircularProgress from '@material-ui/core/CircularProgress';
import Breadcrumbs from 'material/components/layout/Breadcrumbs';
import PageContainer from 'material/components/misc/PageContainer';

const FETCH_INTERVAL = 1000 * 15; // Time (ms) between ticker data updates

function ChartPage({ width }) {
  const containerRef = React.createRef();
  const xs = width === 'xs';
  const center = { alignItems: 'center', justify: 'center' };

  // State
  const [loading, setLoading] = React.useState(true);
  const [symbol, setSymbol] = React.useState('BTCUSDT');
  const { setTickers } = useMst((store) => ({
    setTickers: store.setTickers,
  }));

  const fetchCandlesTimeout = React.useRef(null);

  async function fetchCandles() {
    const result = await apiFetchBinanceFuturesCandles(symbol);
    setLoading(false);
    if (symbol === result.symbol) setTickers([{ symbol, market: '', exchange: '', candlesticks: result.candlesticks }]);
  }

  // Start fetch candles for the current symbol, cancel the previous fetch interval
  function startFetchCandles() {
    setLoading(true);
    if (fetchCandlesTimeout.current) clearInterval(fetchCandlesTimeout.current);
    fetchCandlesTimeout.current = setInterval(() => fetchCandles(), FETCH_INTERVAL);
    fetchCandles();
  }

  // On symbol update
  React.useEffect(() => {
    startFetchCandles();
  }, [symbol]);

  // On mount
  React.useEffect(() => {
    startFetchCandles();

    return () => {
      if (fetchCandlesTimeout.current) clearInterval(fetchCandlesTimeout.current);
    };
  }, []);

  // On symbol select
  function handleSymbolChange(symbol) {
    if (symbol) {
      setSymbol(symbol);
    }
  }

  // Render
  return (
    <PageContainer breadcrumbsItems={['Tools', 'Chart']} ref={containerRef} style={{ minHeight: '900px' }}>
      <Grid {...center} spacing={3} container direction='column' style={{ marginBottom: 10 }}>
        {/* Header */}
        <Grid {...center} container direction='column'>
          <Grid item xs>
            <Typography variant='h6'>CPR + Camarilla Pivots Chart</Typography>
          </Grid>
          <Grid item xs zeroMinWidth>
            <Typography variant='caption'>
              Displaying the latest 500 hours only. The data is updated automatically.
            </Typography>
          </Grid>
        </Grid>

        {/* Symbol selector */}
        <Grid container {...center} spacing={1} direction={xs ? 'column' : 'row'} style={{ marginTop: 15 }}>
          <Grid item xs={10} sm={5} style={xs ? { width: '100%' } : {}} md={3} xl={2}>
            <SymbolsListSelector onSymbolChange={handleSymbolChange} />
          </Grid>
        </Grid>

        {/* Chart options, chart */}
        <Grid item xs>
          {loading ? <CircularProgress /> : <ChartOptions />}
        </Grid>
      </Grid>

      <Chart containerRef={containerRef} />
    </PageContainer>
  );
}

export default withWidth()(ChartPage);
