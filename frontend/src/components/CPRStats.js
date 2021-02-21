import React from "react";
import { Card, Statistic, Row, Col, Progress, Skeleton, Button } from "antd";
import { FallOutlined, RiseOutlined, PauseOutlined } from "@ant-design/icons";
import { useMst } from "../models/Root";
import { observer } from "mobx-react-lite";
import { calcPercent } from "../utils/Helpers";

const CPRStats = observer((props) => {
	const { tickers, cprUntestedCount, cprNeutralCount, cprBelowCount, cprAboveCount, toggleStatsPanel, statsPanelVisible } = useMst((store) => ({
		tickers: store.tickers,
		cprUntestedCount: store.cprUntestedCount,
		cprNeutralCount: store.cprNeutralCount,
		cprBelowCount: store.cprBelowCount,
		cprAboveCount: store.cprAboveCount,
		toggleStatsPanel: store.toggleStatsPanel,
		statsPanelVisible: store.statsPanelVisible,
	}));

	if (!tickers || (tickers.length === 0 && statsPanelVisible)) return <Skeleton />;

	return (
		<>
			<Button style={{ marginBottom: 10 }} onClick={toggleStatsPanel}>
				{statsPanelVisible ? "Hide Statistics" : "Show Statistics"}
			</Button>

			<div>
				{statsPanelVisible ? (
					<>
						<div className="site-statistic-demo-card">
							<Row gutter={12}>
								<Col span={12}>
									<Card>
										<Statistic title="Untested CPR" value={cprUntestedCount(props.timeframe)} precision={0} valueStyle={{ color: "black" }} prefix={"🧲"} suffix="" />
									</Card>
								</Col>
								<Col span={12}>
									<Card>
										<Statistic title="Neutral" value={cprNeutralCount(props.timeframe)} precision={0} valueStyle={{ color: "gray" }} prefix={<PauseOutlined />} suffix="" />
									</Card>
								</Col>
								<Col span={12}>
									<Card>
										<Statistic title="Above CPR" value={cprAboveCount(props.timeframe)} precision={0} valueStyle={{ color: "#3f8600" }} prefix={<RiseOutlined />} suffix="" />
									</Card>
								</Col>
								<Col span={12}>
									<Card>
										<Statistic title="Below CPR" value={cprBelowCount(props.timeframe)} precision={0} valueStyle={{ color: "#cf1322" }} prefix={<FallOutlined />} suffix="" />
									</Card>
								</Col>
								{/*<Col span={12}>
								<Card>
									<Statistic title="Trending" value={trendingCount(props.timeframe)} precision={0} valueStyle={{ color: "#2196F3" }} prefix={<StockOutlined />} suffix="" />
								</Card>
							</Col>
							<Col span={12}>
								<Card>
									<Statistic title="Sideways" value={sidewaysCount(props.timeframe)} precision={0} valueStyle={{ color: "#F38300" }} prefix={<SwapOutlined />} suffix="" />
								</Card>
							</Col>*/}
							</Row>
						</div>

						<div style={{ paddingTop: 10 }}>
							🐂 <font color="green">Bulls {calcPercent(cprAboveCount(props.timeframe), cprAboveCount(props.timeframe) + cprBelowCount(props.timeframe)).toFixed(1)}%</font> <b>vs</b>{" "}
							<font color="red">{calcPercent(cprBelowCount(props.timeframe), cprAboveCount(props.timeframe) + cprBelowCount(props.timeframe)).toFixed(1)}% Bears</font> 🐻
							<Progress
								percent={100}
								success={{ percent: calcPercent(cprAboveCount(props.timeframe), cprAboveCount(props.timeframe) + cprBelowCount(props.timeframe)) }}
								showInfo={false}
								strokeColor="red"
							/>
						</div>
					</>
				) : null}
			</div>
		</>
	);
});

export default CPRStats;
