import { Breadcrumb, Result } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect } from "react";
import { capitalizeFirstLetter } from "../../utils/Helpers";
import { isValidMarket } from "../../utils/Markets";
import { useMst } from "../../models/Root";

export default function CamScreenerPage(props) {
	const market = props.match.params.market;
	const valid_market = market && isValidMarket(market);

	const { tickers, startReceivingData, stopReceivingData } = useMst((store) => ({
		tickers: store.tickers,
		startReceivingData: store.startReceivingData,
		stopReceivingData: store.stopReceivingData,
	}));

	useEffect(() => {
		startReceivingData("daily, monthly, weekly", props.market);

		return () => {
			stopReceivingData();
		};
	}, []);

	return (
		<Content>
			<div className="site-layout-background" style={{ padding: 24, minHeight: 360, marginTop: 10, textAlign: "center" }}>
				<Breadcrumb style={{ marginTop: -5, paddingBottom: 5, textAlign: "left" }}>
					<Breadcrumb.Item>Camarilla Screener</Breadcrumb.Item>
					<Breadcrumb.Item>{capitalizeFirstLetter(market)}</Breadcrumb.Item>
				</Breadcrumb>

				{!valid_market ? <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." /> : <>{market}</>}
			</div>
		</Content>
	);
}
