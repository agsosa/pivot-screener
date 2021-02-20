import React from "react";
import { Card, Statistic, Row, Col, Progress, Skeleton, Collapse } from "antd";
import { SwapOutlined, FallOutlined, RiseOutlined, PauseOutlined, StockOutlined } from "@ant-design/icons";
import { useMst } from "../models/Root";
import { observer } from "mobx-react-lite";
import { calcPercent } from "../utils/Helpers";

const { Panel } = Collapse;

const CPRStats = observer(() => {
	const { tickers, cprUntestedCount, cprNeutralCount, cprBelowCount, cprAboveCount, sidewaysCount, trendingCount } = useMst((store) => ({
		tickers: store.tickers,
		cprUntestedCount: store.cprUntestedCount,
		cprNeutralCount: store.cprNeutralCount,
		cprBelowCount: store.cprBelowCount,
		cprAboveCount: store.cprAboveCount,
		sidewaysCount: store.sidewaysCount,
		trendingCount: store.trendingCount,
	}));

	if (!tickers || tickers.length === 0) return <Skeleton />;

	return (
		<>
			<Collapse defaultActiveKey={["1"]} style={{ marginBottom: 12 }}>
				<Panel header="Statistics" key="1">
					<div className="site-statistic-demo-card">
						<Row gutter={12}>
							<Col span={12}>
								<Card>
									<Statistic title="Untested CPR" value={cprUntestedCount} precision={0} valueStyle={{ color: "black" }} prefix={"🧲"} suffix="" />
								</Card>
							</Col>
							<Col span={12}>
								<Card>
									<Statistic title="Neutral" value={cprNeutralCount} precision={0} valueStyle={{ color: "gray" }} prefix={<PauseOutlined />} suffix="" />
								</Card>
							</Col>
							<Col span={12}>
								<Card>
									<Statistic title="Above CPR" value={cprAboveCount} precision={0} valueStyle={{ color: "#3f8600" }} prefix={<RiseOutlined />} suffix="" />
								</Card>
							</Col>
							<Col span={12}>
								<Card>
									<Statistic title="Below CPR" value={cprBelowCount} precision={0} valueStyle={{ color: "#cf1322" }} prefix={<FallOutlined />} suffix="" />
								</Card>
							</Col>
							<Col span={12}>
								<Card>
									<Statistic title="Trending" value={trendingCount} precision={0} valueStyle={{ color: "#2196F3" }} prefix={<StockOutlined />} suffix="" />
								</Card>
							</Col>
							<Col span={12}>
								<Card>
									<Statistic title="Sideways" value={sidewaysCount} precision={0} valueStyle={{ color: "#F38300" }} prefix={<SwapOutlined />} suffix="" />
								</Card>
							</Col>
						</Row>
					</div>

					<div style={{ paddingTop: 10 }}>
						🐂 <font color="green">Bulls {calcPercent(cprAboveCount, cprAboveCount + cprBelowCount).toFixed(1)}%</font> <b>vs</b>{" "}
						<font color="red">{calcPercent(cprBelowCount, cprAboveCount + cprBelowCount).toFixed(1)}% Bears</font> 🐻
						<Progress percent={100} success={{ percent: calcPercent(cprAboveCount, cprAboveCount + cprBelowCount) }} showInfo={false} strokeColor="red" />
					</div>
				</Panel>
			</Collapse>
		</>
	);
});

export default CPRStats;
