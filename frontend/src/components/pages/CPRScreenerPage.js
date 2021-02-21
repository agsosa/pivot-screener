import { Breadcrumb, Result, Tabs } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect } from "react";
import { useMst } from "../../models/Root";
import { Tag } from "antd";
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

import { capitalizeFirstLetter } from "../../utils/Helpers";
import { isValidMarket } from "../../utils/Markets";
import CPRTable from "../CPRTable";
import { observer } from "mobx-react-lite";

const CPRScreenerPage = observer((props) => {
	const market = props.match.params.market;
	const valid_market = market && isValidMarket(market);
	const { TabPane } = Tabs;

	const { startReceivingData, stopReceivingData, socketConnected } = useMst((store) => ({
		startReceivingData: store.startReceivingData,
		stopReceivingData: store.stopReceivingData,
		socketConnected: store.socketConnected,
	}));

	useEffect(() => {
		if (valid_market) {
			/*
			const f = () => fetchTickers("daily, monthly, weekly");
			f();
			interval = setInterval(f, 5000); // TODO: PASS MARKET*/

			startReceivingData("daily, weekly, monthly", market, "BTCUSDT");
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

				<div style={{ textAlign: "right", marginTop: -25, marginRight: "10%", transform: "scale(1.2)" }}>
					{socketConnected ? (
						<Tag icon={<CheckCircleOutlined />} color="success">
							ONLINE
						</Tag>
					) : (
						<Tag icon={<CloseCircleOutlined />} color="error">
							OFFLINE
						</Tag>
					)}
				</div>

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
							<TabPane tab="Tomorrow" key="4" disabled>
								<CPRTable timeframe="tomorrow" market={market} />
							</TabPane>
							<TabPane tab="Next Week" key="5" disabled>
								<CPRTable timeframe="nextweek" market={market} />
							</TabPane>
							<TabPane tab="Next Month" key="6" disabled>
								<CPRTable timeframe="nextmonth" market={market} />
							</TabPane>
						</Tabs>
					</>
				)}
			</div>
		</Content>
	);
});

export default CPRScreenerPage;
