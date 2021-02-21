import { Breadcrumb, Result, Tabs } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect } from "react";
import { useMst } from "../../models/Root";
import { capitalizeFirstLetter } from "../../utils/Helpers";
import { isValidMarket } from "../../utils/Markets";
import CPRStats from "../CPRStats";
import CPRTable from "../CPRTable";

export default function CPRScreenerPage(props) {
	let interval;

	const market = props.match.params.market;
	const valid_market = market && isValidMarket(market);
	const { TabPane } = Tabs;

	const { fetchTickers, startReceivingData, stopReceivingData } = useMst((store) => ({
		fetchTickers: store.fetchTickers,
		startReceivingData: store.startReceivingData,
		stopReceivingData: store.stopReceivingData,
	}));

	useEffect(() => {
		if (valid_market) {
			/*
			const f = () => fetchTickers("daily, monthly, weekly");
			f();
			interval = setInterval(f, 5000); // TODO: PASS MARKET*/

			startReceivingData("daily, monthly, weekly", market);
		}

		return () => {
			//if (interval) clearInterval(interval);
			stopReceivingData();
		};
	}, []);

	return (
		<Content>
			<div className="site-layout-background" style={{ padding: 24, minHeight: 360, marginTop: 10, textAlign: "center" }}>
				<Breadcrumb style={{ marginTop: -5, paddingBottom: 5, textAlign: "left" }}>
					<Breadcrumb.Item>CPR Screener</Breadcrumb.Item>
					<Breadcrumb.Item>{capitalizeFirstLetter(market)}</Breadcrumb.Item>
				</Breadcrumb>

				{!valid_market ? (
					<Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />
				) : (
					<>
						<Tabs defaultActiveKey="1">
							<TabPane tab="Daily" key="1">
								<CPRTable timeframe="daily" market={market} />
							</TabPane>
							<TabPane tab="Weekly" key="2">
								<CPRTable timeframe="weekly" market={market} />
							</TabPane>
							<TabPane tab="Monthly" key="3">
								<CPRTable timeframe="monthly" market={market} />
							</TabPane>
							<TabPane tab="Tomorrow" key="3" disabled>
								<CPRTable timeframe="tomorrow" market={market} />
							</TabPane>
							<TabPane tab="Next Week" key="3" disabled>
								<CPRTable timeframe="nextweek" market={market} />
							</TabPane>
							<TabPane tab="Next Month" key="3" disabled>
								<CPRTable timeframe="nextmonth" market={market} />
							</TabPane>
						</Tabs>
					</>
				)}
			</div>
		</Content>
	);
}
