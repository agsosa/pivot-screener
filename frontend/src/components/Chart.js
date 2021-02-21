import { createChart, CrosshairMode, LineStyle, PriceScaleMode } from "lightweight-charts";
import React from "react";
import { percentage } from "../utils/Helpers";

const marginPctHeight = 0;
const marginPctWidth = 0;

let chart;
let series;

const resizeObserver = new ResizeObserver((entries) => {
	if (chart) {
		chart.resize(
			entries[0].target.offsetWidth - percentage(marginPctWidth, entries[0].target.offsetWidth),
			entries[0].target.offsetHeight - percentage(marginPctHeight, entries[0].target.offsetHeight)
		);
	}
});

export const Chart = (props) => {
	const chartRef = React.useRef(null);

	React.useEffect(() => {
		// Create chart
		if (chartRef.current) {
			console.log("hola");

			resizeObserver.observe(chartRef.current);

			let box = document.getElementsByClassName("site-layout-background")[0];
			let width = box.offsetWidth - percentage(marginPctWidth, box.offsetWidth);
			let height = box.offsetHeight - percentage(marginPctHeight, box.offsetHeight);

			chart = createChart(chartRef.current, {
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

			series = chart.addCandlestickSeries({
				upColor: "rgb(38,166,154)",
				downColor: "rgb(255,82,82)",
				wickUpColor: "rgb(38,166,154)",
				wickDownColor: "rgb(255,82,82)",
				borderVisible: false,
			});

			series.applyOptions({ priceLineVisible: false, priceFormat: { type: "price", minMove: 0.0000001, precision: 8 } });

			chart.applyOptions({
				timeScale: {
					rightOffset: 100,
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

			if (props.onLoadComplete) {
				props.onLoadComplete();
			}
		}

		return () => {
			// On unmount
			chart.remove();
			chart = null;
			series = null;
			//currentSymbolData = null;
		};
	}, []);

	return <div ref={chartRef} />;
};
