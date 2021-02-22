import { createChart, CrosshairMode, LineStyle, PriceScaleMode } from "lightweight-charts";
import React, { useState, useRef } from "react";
import { percentage } from "../utils/Helpers";
import { observer } from "mobx-react-lite";
import { useMst } from "./../models/Root";
import { reaction, autorun } from "mobx";
import moment from "moment";
import { Switch, Space, Button } from "antd";

export const Chart = observer((props) => {
	/*const [chart, setChart] = useState();
	const [series, setSeries] = useState();*/
	//const [chartOptions, setChartOptions] = useState({ dailyCPR: false, weeklyCPR: false, monthlyCPR: true, dailyCAM: false, weeklyCAM: false, monthlyCAM: true, futureMode: false });
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

	dispose2.current = reaction(
		() => chartOptions,
		(chartOptions) => {
			console.log(chartOptions);
			updateChart(tickers[0]);
		},
		{ fireImmediately: true }
	);

	dispose.current = reaction(
		() => tickers,
		(tickers) => {
			if (tickers && tickers.length >= 1) {
				if (!lastData.current || tickers[0].price !== lastData.current.price) updateChart(tickers[0]);
			}
		},
		{ fireImmediately: true }
	);

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

	function updateChart(data) {
		if (data) {
			console.log("Chart updateChart symbol = " + data.symbol + "price = " + data.price);
			if (data.candlesticks && data.candlesticks.hourlyCandles && data.candlesticks.dailyCandles) {
				series.current.setData([]);

				chart.current.applyOptions({
					watermark: {
						color: "rgba(11, 0, 0, 0.4)",
						visible: true,
						text: data.symbol + " (1h)",
						fontSize: 38,
						horzAlign: "right",
						vertAlign: "bottom",
					},
				});
				/*data.candlesticks.dailyCandles.sort(function (a, b) {
				return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
			});*/

				for (let i = 0; i < data.candlesticks.hourlyCandles.length; i++) {
					let e = data.candlesticks.hourlyCandles[i];
					let d = {};
					d.open = +e.open;
					d.high = +e.high;
					d.low = +e.low;
					d.close = +e.close;
					d.time = new Date(e.timestamp) / 1000;
					series.current.update(d);
				}

				console.log("1");
				// initializeDrawings solo debe ser llamado cuando se cambie de symbol o cuando se detecte una nueva dailyCandle
				//if (lastData && (lastData.symbol != data.symbol || lastData.candlesticks.dailyCandles != data.candlesticks.dailyCandles)) clearDrawings();
				if (!lastData.current) initializeDrawings(data);
				else {
					const a = lastData.current.candlesticks.dailyCandles;
					const b = data.candlesticks.dailyCandles;
					if (a[a.length - 1].timestamp !== b[b.length - 1].timestamp || lastData.current.symbol !== data.symbol) {
						if (lastData.current.symbol !== data.symbol) chart.current.priceScale().applyOptions({ autoScale: true });
						initializeDrawings(data);
					}
				}
				console.log("End of updatedat");
				lastData.current = data;
			}
		}
	}

	function initializeDrawings(data) {
		if (data) {
			clearDrawings();
			console.log("initializedrawings");

			const timeframes = [
				// label, color, togglecpr, togglecam
				["daily", "green", chartOptions.dailyCPR, chartOptions.dailyCam],
				["weekly", "blue", chartOptions.weeklyCPR, chartOptions.weeklyCam],
				["monthly", "red", chartOptions.monthlyCPR, chartOptions.monthlyCam],
			];

			timeframes.forEach((t) => {
				const label = t[0];
				const color = t[1];
				const showCPR = t[2];
				const showCam = t[3];
				// CPR
				const cpr = data.getCPR(label);
				if (cpr && showCPR) {
					const p = series.current.createPriceLine({ price: cpr.p, color: color, lineWidth: 3, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: label + " P" });
					const bc = series.current.createPriceLine({ price: cpr.bc, color: color, lineWidth: 3, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: label + " BC" });
					const tc = series.current.createPriceLine({ price: cpr.tc, color: color, lineWidth: 3, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: label + " TC" });
					drawings.current[label + "CPR"] = [p, bc, tc];
				}

				const cam = data.getCamarilla(label);
				if (cam && showCam) {
					for (const [key, value] of Object.entries(cam)) {
						const obj = series.current.createPriceLine({ price: cam[key], color: color, lineWidth: 2, lineStyle: LineStyle.Solid, axisLabelVisible: true, title: label + " " + key.toUpperCase() });
						drawings.current[label + "Cam"].push(obj);
					}
				}
			});
		}
	}

	function clearDrawings() {
		console.log("clearDrawings llamado");

		for (const [key, value] of Object.entries(drawings.current)) {
			console.log(`${key}: ${value}`);
			drawings.current[key].map((q) => series.current.removePriceLine(q));
			drawings.current[key] = [];
		}
		console.log("end of cleardrawings");

		/*drawings.forEach((d) => {
			d.forEach((q) => {
				series.removePriceLine(q);
			});

			d = [];
		});*/
	}

	React.useEffect(() => {
		if (chartRef.current) {
			resizeObserver.observe(chartRef.current);

			let box = document.getElementsByClassName("site-layout-background")[0];
			let width = box.offsetWidth - percentage(marginPctWidth, box.offsetWidth);
			let height = box.offsetHeight - percentage(marginPctHeight, box.offsetHeight);

			chart.current = createChart(chartRef.current, {
				width: width,
				height: height,
				localization: {
					timeFormatter: (businessDayOrTimestamp) => {
						return Date(businessDayOrTimestamp); //or whatever JS formatting you want here
					},
				},
				timeScale: {
					timeVisible: true,
					borderColor: "#D1D4DC",
				},
				rightPriceScale: {
					borderColor: "#D1D4DC",
				},
				layout: {
					backgroundColor: "#ffffff",
					textColor: "#000",
				},
				grid: {
					horzLines: {
						color: "#F0F3FA",
						visible: false,
					},
					vertLines: {
						visible: false,
						color: "#F0F3FA",
					},
				},
			});

			series.current = chart.current.addCandlestickSeries({
				upColor: "rgb(38,166,154)",
				downColor: "rgb(255,82,82)",
				wickUpColor: "rgb(38,166,154)",
				wickDownColor: "rgb(255,82,82)",
				borderVisible: false,
			});

			series.current.applyOptions({ priceLineVisible: false, priceFormat: { type: "price", minMove: 0.0000001, precision: 8 } });

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

			//InitializeDrawings();
			//updateChart();
			if (props.onLoadComplete) props.onLoadComplete();
		}

		return () => {
			// On unmount
			chart.current.remove();
			dispose.current();
			dispose2.current();
			//currentSymbolData = null;
		};
	}, []);

	return (
		<>
			<Space direction="vertical">
				<Space>
					<span style={{ marginRight: 10 }}>
						<Button primary onClick={() => chartOptions.toggleAllDaily()}>
							Toggle Daily
						</Button>
					</span>
					<span style={{ marginRight: 10 }}>
						<Button primary onClick={() => chartOptions.toggleAllWeekly()}>
							Toggle Weekly
						</Button>
					</span>
					<span style={{ marginRight: 10 }}>
						<Button primary onClick={() => chartOptions.toggleAllMonthly()}>
							Toggle Monthly
						</Button>
					</span>
					<span style={{ marginRight: 20 }}>
						Show developing pivots:{" "}
						<Switch
							size="small"
							disabled
							checked={chartOptions.futureMode}
							onChange={(checked) => {
								chartOptions.setFutureMode(checked);
							}}
						/>
					</span>
				</Space>
				<Space>
					<span style={{ marginRight: 20 }}>
						Daily CPR: <Switch size="small" checked={chartOptions.dailyCPR} onChange={(checked) => chartOptions.setDailyCPR(checked)} />
					</span>

					<span style={{ marginRight: 20 }}>
						Weekly CPR: <Switch size="small" checked={chartOptions.weeklyCPR} onChange={(checked) => chartOptions.setWeeklyCPR(checked)} />
					</span>
					<span style={{ marginRight: 20 }}>
						Monthly CPR: <Switch size="small" checked={chartOptions.monthlyCPR} onChange={(checked) => chartOptions.setMonthlyCPR(checked)} />
					</span>
				</Space>
				<Space>
					<span style={{ marginRight: 20 }}>
						Daily Camarilla: <Switch size="small" checked={chartOptions.dailyCam} onChange={(checked) => chartOptions.setDailyCam(checked)} />
					</span>
					<span style={{ marginRight: 20 }}>
						Weekly Camarilla: <Switch size="small" checked={chartOptions.weeklyCam} onChange={(checked) => chartOptions.setWeeklyCam(checked)} />
					</span>
					<span style={{ marginRight: 20 }}>
						Monthly Camarilla: <Switch size="small" checked={chartOptions.monthlyCam} onChange={(checked) => chartOptions.setMonthlyCam(checked)} />
					</span>
				</Space>
			</Space>
			<div ref={chartRef} />
		</>
	);
});
