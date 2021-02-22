import { Result, Tabs } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect } from "react";
import { useMst } from "../../models/Root";
import { Tag } from "antd";
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

import { capitalizeFirstLetter } from "../../utils/Helpers";
import { isValidMarket } from "../../utils/Markets";
import CamTable from "../CamTable";
import { observer } from "mobx-react-lite";
import Breadcrumb from "../Breadcrumb";

const CamScreenerPage = observer((props) => {
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
				<Breadcrumb items={["Camarilla Screener", capitalizeFirstLetter(market)]} />
				{!valid_market ? (
					<Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />
				) : (
					<>
						<Tabs defaultActiveKey="1">
							<TabPane tab="Daily" key="1">
								<CamTable timeframe="daily" market={market} />
							</TabPane>
							<TabPane tab="Weekly" key="2">
								<CamTable timeframe="weekly" market={market} />
							</TabPane>
							<TabPane tab="Monthly" key="3">
								<CamTable timeframe="monthly" market={market} />
							</TabPane>
							<TabPane tab="Tomorrow" key="4" disabled>
								<CamTable timeframe="tomorrow" market={market} />
							</TabPane>
							<TabPane tab="Next Week" key="5" disabled>
								<CamTable timeframe="nextweek" market={market} />
							</TabPane>
							<TabPane tab="Next Month" key="6" disabled>
								<CamTable timeframe="nextmonth" market={market} />
							</TabPane>
						</Tabs>
					</>
				)}
			</div>
		</Content>
	);
});

export default CamScreenerPage;
