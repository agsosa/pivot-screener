import React, { useState, useEffect } from "react";
import moment from "moment";

// TODO: Refactor

export default function DailyCloseTime(props) {
	const getDailyClose = (exchange = "binance") => {
		// Binance
		const now = moment();
		const time = exchange === "binance" ? moment(now) : moment(now).utcOffset(5);
		const dif = time.endOf("day").diff(now);

		return moment(dif).format("HH:mm:ss");
	};

	const [binanceTimeleft, setBinanceTimeleft] = useState(getDailyClose("binance"));
	const [huobiTimeleft, SetHuobiTimeleft] = useState(getDailyClose("huobi"));

	useEffect(() => {
		const timer = setTimeout(() => {
			setBinanceTimeleft(getDailyClose("binance"));
			SetHuobiTimeleft(getDailyClose("huobi"));
		}, 1000);
		return () => clearTimeout(timer);
	});

	return (
		<div>
			Binance Daily Close: {binanceTimeleft.toString()}
			<br />
			Huobi Daily Close: {huobiTimeleft.toString()}
		</div>
	);
}
