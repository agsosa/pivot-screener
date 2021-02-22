import React from "react";
import { Card, Statistic, Row, Col, Progress, Skeleton, Button } from "antd";
import { FallOutlined, RiseOutlined, ExclamationCircleOutlined, ColumnHeightOutlined } from "@ant-design/icons";
import { useMst } from "../models/Root";
import { observer } from "mobx-react-lite";
import { calcPercent } from "../utils/Helpers";

const CamStats = observer((props) => {
	const { tickers, cprUntestedCount, cprNeutralCount, cprBelowCount, cprAboveCount, toggleCamStatsPanel, camStatsPanelVisible, camStats } = useMst((store) => ({
		tickers: store.tickers,
		cprUntestedCount: store.cprUntestedCount,
		cprNeutralCount: store.cprNeutralCount,
		cprBelowCount: store.cprBelowCount,
		cprAboveCount: store.cprAboveCount,
		toggleCamStatsPanel: store.toggleCamStatsPanel,
		camStatsPanelVisible: store.camStatsPanelVisible,

		camStats: store.camStats,
	}));

	if (!tickers || (tickers.length === 0 && camStatsPanelVisible)) return <Skeleton />;

	return (
		<>
			<Button style={{ marginBottom: 10 }} onClick={toggleCamStatsPanel}>
				{camStatsPanelVisible ? "Hide Statistics" : "Show Statistics"}
			</Button>

			<div>
				{camStatsPanelVisible ? (
					<>
						<div className="site-statistic-demo-card">
							<Row gutter={12}>
								<Col span={12}>
									<Card>
										<Statistic title="Above H4" value={camStats(props.timeframe).aboveH4} precision={0} valueStyle={{ color: "#3f8600" }} prefix={<RiseOutlined />} suffix="" />
									</Card>
								</Col>

								<Col span={12}>
									<Card>
										<Statistic title="Below L4" value={camStats(props.timeframe)} precision={0} valueStyle={{ color: "#cf1322" }} prefix={<FallOutlined />} suffix="" />
									</Card>
								</Col>
								<Col span={12}>
									<Card>
										<Statistic title="Above H3" value={camStats(props.timeframe)} precision={0} valueStyle={{ color: "orange" }} prefix={<ExclamationCircleOutlined />} suffix="" />
									</Card>
								</Col>
								<Col span={12}>
									<Card>
										<Statistic title="Below L3" value={camStats(props.timeframe)} precision={0} valueStyle={{ color: "orange" }} prefix={<ExclamationCircleOutlined />} suffix="" />
									</Card>
								</Col>
								<Col span={24}>
									<Card>
										<Statistic title="Between L3 and H3" value={cprNeutralCount(props.timeframe)} precision={0} valueStyle={{ color: "gray" }} prefix={<ColumnHeightOutlined />} suffix="" />
									</Card>
								</Col>

								{/*
																<Col span={12}>
									<Card>
										<Statistic title="Between L3 and H3" value={cprNeutralCount(props.timeframe)} precision={0} valueStyle={{ color: "gray" }} prefix={<ColumnHeightOutlined />} suffix="" />
									</Card>
								</Col>
								
								<Col span={12}>
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
							{" "}
							{/*TODO: Modularizar calcPercent xq se repite mucho, quizas pasar a rootstore*/}
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

export default CamStats;
