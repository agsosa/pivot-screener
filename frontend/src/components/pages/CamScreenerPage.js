import { Result } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect } from "react";
import { capitalizeFirstLetter } from "../../utils/Helpers";
import { isValidMarket } from "../../utils/Markets";
import { useMst } from "../../models/Root";
import Breadcrumb from "./../Breadcrumb";

export default function CamScreenerPage(props) {
	const market = props.match.params.market;
	const valid_market = market && isValidMarket(market);

	const { tickers, startReceivingData, stopReceivingData } = useMst((store) => ({
		tickers: store.tickers,
		startReceivingData: store.startReceivingData,
		stopReceivingData: store.stopReceivingData,
	}));

	useEffect(() => {
		return () => {
			stopReceivingData();
		};
	}, []);

	return (
		<Content>
			<div className="site-layout-background" style={{ padding: 24, minHeight: 360, marginTop: 10, textAlign: "center" }}>
				<Breadcrumb items={["Camarilla Screener", capitalizeFirstLetter(market)]} />

				{!valid_market ? <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." /> : <>{market}</>}
			</div>
		</Content>
	);
}
