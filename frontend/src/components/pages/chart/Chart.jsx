import { createChart, CrosshairMode, LineStyle, PriceScaleMode } from 'lightweight-charts';
import React, { useRef, useEffect } from 'react';
import { reaction } from 'mobx';
import { useMst } from '../../../models/Root';
import { percentage } from '../../../lib/Helpers';

const marginPctHeight = 0;
const marginPctWidth = 0;

const Chart = () => {
	const chart = useRef(null);
	const chartRef = useRef(null);
	const series = useRef(null);
	const lastData = useRef(null);
	const drawings = useRef({ dailyCPR: [], weeklyCPR: [], monthlyCPR: [], dailyCam: [], weeklyCam: [], monthlyCam: [] });

	const { tickers, chartOptions } = useMst((store) => ({
		tickers: store.tickers,
		chartOptions: store.chartOptions,
	}));

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

	// eslint-disable-next-line
	// Force chart to update the series with the current first element at tickers state
	function updateChart(forceDrawingsRefresh = false) {
		const data = tickers && tickers.length >= 1 ? tickers[0] : null;

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

				for (let i = 0; i < data.candlesticks.hourlyCandles.length; i += 1) {
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

				lastData.current = JSON.parse(JSON.stringify(data));
			}
		}
	}

	// Create lightweight-chart
	function initializeChart() {
		const box = document.getElementsByClassName('site-layout-background')[0];
		const width = box.offsetWidth - percentage(marginPctWidth, box.offsetWidth);
		const height = box.offsetHeight - percentage(marginPctHeight, box.offsetHeight);

		chart.current = createChart(chartRef.current, {
			width,
			height,
			localization: {
				timeFormatter: (businessDayOrTimestamp) => Date(businessDayOrTimestamp),
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
					visible: false,
				},
				vertLines: {
					visible: false,
				},
			},
		});

		resizeObserver.observe(chartRef.current);

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
	}

	useEffect(() => {
		initializeChart();

		// Mobx
		const dispose = reaction(
			() => Object.keys(chartOptions).map((q) => chartOptions[q]),
			() => {
				if (lastData.current) updateChart(true);
			},
			{ fireImmediately: true }
		);

		const dispose2 = reaction(
			() => tickers.map((q) => q),
			() => {
				updateChart();
			},
			{ fireImmediately: true }
		);

		return () => {
			chart.current.remove();
			dispose();
			dispose2();
		};
	}, []);

	return <div ref={chartRef} />;
};

export default Chart;
