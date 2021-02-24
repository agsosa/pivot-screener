import { Result, Tabs } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect } from "react";
import { useMst } from "../../models/Root";
import { Tag } from "antd";
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

import { capitalizeFirstLetter } from "../../utils/Helpers";
import { isValidMarket } from "../../utils/Markets";
import CPRTable from "../CPRTable";
import { observer } from "mobx-react-lite";
import Breadcrumb from "../Breadcrumb";

const CPRScreenerPage = observer((props) => {
	const market = props.match.params.market;
	const valid_market = market && isValidMarket(market);
	const { TabPane } = Tabs;

	const { startReceivingData, stopReceivingData } = useMst((store) => ({
		startReceivingData: store.startReceivingData,
		stopReceivingData: store.stopReceivingData,
	}));

	useEffect(() => {
		if (valid_market) {
			/*
			const f = () => fetchTickers("daily, monthly, weekly");
			f();
			interval = setInterval(f, 5000); // TODO: PASS MARKET*/

			startReceivingData("daily, weekly, monthly", market);
		}

		return () => {
			//if (interval) clearInterval(interval);
			stopReceivingData();
		};
	}, []);

	return (
		<Content>
			<div className="site-layout-background" style={{ padding: 24, minHeight: 360, marginTop: 10, textAlign: "center" }}>
				<Breadcrumb items={["CPR Screener", capitalizeFirstLetter(market)]} />

				{!valid_market ? (
					<Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />
				) : (
					<>
						<Tabs defaultActiveKey="1">
							<TabPane tab="Daily" key="1">
								<CPRTable timeframe="daily" market={market} futureMode={false} />
							</TabPane>
							<TabPane tab="Weekly" key="2">
								<CPRTable timeframe="weekly" market={market} futureMode={false} />
							</TabPane>
							<TabPane tab="Monthly" key="3">
								<CPRTable timeframe="monthly" market={market} futureMode={false} />
							</TabPane>
							<TabPane tab="Tomorrow" key="4">
								<CPRTable timeframe="daily" market={market} futureMode={true} />
							</TabPane>
							<TabPane tab="Next Week" key="5">
								<CPRTable timeframe="weekly" market={market} futureMode={true} />
							</TabPane>
							<TabPane tab="Next Month" key="6">
								<CPRTable timeframe="monthly" market={market} futureMode={true} />
							</TabPane>
						</Tabs>
					</>
				)}
			</div>
		</Content>
	);
});

export default CPRScreenerPage;
