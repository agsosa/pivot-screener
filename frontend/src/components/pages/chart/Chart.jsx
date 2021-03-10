import { createChart, CrosshairMode, LineStyle, PriceScaleMode } from 'lightweight-charts';
import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { reaction } from 'mobx';
import { Switch, Space, Button } from 'antd';
import { useMst } from '../../../models/Root';
import { percentage } from '../../../lib/Helpers';

const Chart = observer((props) => {
	const chart = useRef(null);
	const series = useRef(null);
	const dispose = useRef(null);
	const dispose2 = useRef(null);
	const drawings = useRef({ dailyCPR: [], weeklyCPR: [], monthlyCPR: [], dailyCam: [], weeklyCam: [], monthlyCam: [] });
	const lastData = useRef(null);

	const { tickers, chartOptions } = useMst((store) => ({
		tickers: store.tickers,
		chartOptions: store.chartOptions,
	}));

	const chartRef = React.useRef(null);
	const marginPctHeight = 0;
	const marginPctWidth = 0;

	const resizeObserver = new ResizeObserver((entries) => {
		if (chart.current) {
			chart.current.resize(
				entries[0].target.offsetWidth - percentage(marginPctWidth, entries[0].target.offsetWidth),
				entries[0].target.offsetHeight - percentage(marginPctHeight, entries[0].target.offsetHeight)
			);
		}
	});

	function clearDrawings() {
		// eslint-disable-next-line no-unused-vars
		Object.entries(drawings.current).forEach(([key, value]) => {
			drawings.current[key].map((q) => series.current.removePriceLine(q));
			drawings.current[key] = [];
		});
	}

	function initializeDrawings(data) {
		if (data) {
			clearDrawings();

			const timeframes = [
				// label, color, togglecpr, togglecam
				['daily', 'green', chartOptions.dailyCPR, chartOptions.dailyCam],
				['weekly', 'blue', chartOptions.weeklyCPR, chartOptions.weeklyCam],
				['monthly', 'red', chartOptions.monthlyCPR, chartOptions.monthlyCam],
			];

			timeframes.forEach((t) => {
				const label = t[0];
				const color = t[1];
				const showCPR = t[2];
				const showCam = t[3];
				// CPR
				const cpr = data.getCPR(label, chartOptions.futureMode);
				if (cpr && showCPR) {
					const p = series.current.createPriceLine({ price: cpr.p, color, lineWidth: 3, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: `${label} P` });
					const bc = series.current.createPriceLine({ price: cpr.bc, color, lineWidth: 3, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: `${label} BC` });
					const tc = series.current.createPriceLine({ price: cpr.tc, color, lineWidth: 3, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: `${label} TC` });
					drawings.current[`${label}CPR`] = [p, bc, tc];
				}
				// Camarilla
				const cam = data.getCamarilla(label, chartOptions.futureMode);
				if (cam && showCam) {
					const levels = ['h4', 'h3', 'h5', 'h6', 'l4', 'l3', 'l5', 'l6'];
					for (let i = 0; i < levels.length; i += 1) {
						const key = levels[i];
						const obj = series.current.createPriceLine({ price: cam[key], color, lineWidth: 2, lineStyle: LineStyle.Solid, axisLabelVisible: true, title: `${label} ${key.toUpperCase()}` });
						drawings.current[`${label}Cam`].push(obj);
					}
				}
			});
		}
	}

	function updateChart(data, forceDrawingsRefresh = false) {
		if (data) {
			if (data.candlesticks && data.candlesticks.hourlyCandles && data.candlesticks.dailyCandles) {
				series.current.setData([]);

				chart.current.applyOptions({
					watermark: {
						color: 'rgba(11, 0, 0, 0.4)',
						visible: true,
						text: `${data.symbol} (1h)`,
						fontSize: 38,
						horzAlign: 'right',
						vertAlign: 'bottom',
					},
				});

				for (let i = 0; i < data.candlesticks.hourlyCandles.length; i++) {
					const e = data.candlesticks.hourlyCandles[i];
					const d = {};
					d.open = +e.open;
					d.high = +e.high;
					d.low = +e.low;
					d.close = +e.close;
					d.time = new Date(e.timestamp) / 1000;
					series.current.update(d);
				}

				if (!lastData.current) initializeDrawings(data);
				else {
					const a = lastData.current.candlesticks.dailyCandles;
					const b = data.candlesticks.dailyCandles;
					if (a[a.length - 1].timestamp !== b[b.length - 1].timestamp || lastData.current.symbol !== data.symbol || forceDrawingsRefresh) {
						if (lastData.current.symbol !== data.symbol) chart.current.priceScale().applyOptions({ autoScale: true });
						initializeDrawings(data);
					}
				}

				lastData.current = data;
			}
		}
	}

	dispose2.current = reaction(
		() => chartOptions,
		() => {
			if (tickers && tickers.length >= 1) {
				updateChart(tickers[0], true);
			}
		},
		{ fireImmediately: true }
	);

	dispose.current = reaction(
		() => tickers,
		(tickersState) => {
			if (tickersState && tickersState.length >= 1) {
				if (!lastData.current || tickersState[0].price !== lastData.current.price) updateChart(tickersState[0]);
			}
		},
		{ fireImmediately: true }
	);

	React.useEffect(() => {
		if (chartRef.current) {
			resizeObserver.observe(chartRef.current);

			const box = document.getElementsByClassName('site-layout-background')[0];
			const width = box.offsetWidth - percentage(marginPctWidth, box.offsetWidth);
			const height = box.offsetHeight - percentage(marginPctHeight, box.offsetHeight);

			chart.current = createChart(chartRef.current, {
				width,
				height,
				localization: {
					timeFormatter: (businessDayOrTimestamp) => Date(businessDayOrTimestamp), // or whatever JS formatting you want here
				},
				timeScale: {
					timeVisible: true,
					borderColor: '#D1D4DC',
				},
				rightPriceScale: {
					borderColor: '#D1D4DC',
				},
				layout: {
					backgroundColor: '#ffffff',
					textColor: '#000',
				},
				grid: {
					horzLines: {
						color: '#F0F3FA',
						visible: false,
					},
					vertLines: {
						visible: false,
						color: '#F0F3FA',
					},
				},
			});

			series.current = chart.current.addCandlestickSeries({
				upColor: 'rgb(38,166,154)',
				downColor: 'rgb(255,82,82)',
				wickUpColor: 'rgb(38,166,154)',
				wickDownColor: 'rgb(255,82,82)',
				borderVisible: false,
			});

			series.current.applyOptions({ priceLineVisible: false, priceFormat: { type: 'price', minMove: 0.0000001, precision: 8 } });

			chart.current.applyOptions({
				timeScale: {
					rightOffset: 50,
				},
				crosshair: {
					mode: CrosshairMode.Normal,
				},
				priceScale: {
					autoScale: true,
					mode: PriceScaleMode.Logarithmic,
				},
			});

			if (props.onLoadComplete) props.onLoadComplete();
		}

		return () => {
			chart.current.remove();
			dispose.current();
			dispose2.current();
		};
	}, []);

	return (
		<div>
			<Space direction='vertical'>
				<Space>
					<span style={{ marginRight: 10 }}>
						<Button onClick={() => chartOptions.toggleAllDaily()}>Toggle Daily</Button>
					</span>
					<span style={{ marginRight: 10 }}>
						<Button onClick={() => chartOptions.toggleAllWeekly()}>Toggle Weekly</Button>
					</span>
					<span style={{ marginRight: 10 }}>
						<Button onClick={() => chartOptions.toggleAllMonthly()}>Toggle Monthly</Button>
					</span>
					<span style={{ marginRight: 20 }}>
						<span style={chartOptions.futureMode ? { fontWeight: 'bold', color: 'red' } : {}}>Show developing pivots: </span>
						<Switch
							size='small'
							checked={chartOptions.futureMode}
							onChange={(checked) => {
								chartOptions.setFutureMode(checked);
							}}
						/>
					</span>
				</Space>
				<Space>
					<span style={{ marginRight: 20 }}>
						Daily CPR: <Switch size='small' checked={chartOptions.dailyCPR} onChange={(checked) => chartOptions.setDailyCPR(checked)} />
					</span>

					<span style={{ marginRight: 20 }}>
						Weekly CPR: <Switch size='small' checked={chartOptions.weeklyCPR} onChange={(checked) => chartOptions.setWeeklyCPR(checked)} />
					</span>
					<span style={{ marginRight: 20 }}>
						Monthly CPR: <Switch size='small' checked={chartOptions.monthlyCPR} onChange={(checked) => chartOptions.setMonthlyCPR(checked)} />
					</span>
				</Space>
				<Space>
					<span style={{ marginRight: 20 }}>
						Daily Camarilla: <Switch size='small' checked={chartOptions.dailyCam} onChange={(checked) => chartOptions.setDailyCam(checked)} />
					</span>
					<span style={{ marginRight: 20 }}>
						Weekly Camarilla: <Switch size='small' checked={chartOptions.weeklyCam} onChange={(checked) => chartOptions.setWeeklyCam(checked)} />
					</span>
					<span style={{ marginRight: 20 }}>
						Monthly Camarilla: <Switch size='small' checked={chartOptions.monthlyCam} onChange={(checked) => chartOptions.setMonthlyCam(checked)} />
					</span>
				</Space>
			</Space>

			<div ref={chartRef} />
		</div>
	);
});

export default Chart;
