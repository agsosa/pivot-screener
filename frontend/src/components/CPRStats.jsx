import React from 'react';
import { Card, Statistic, Row, Col, Progress, Skeleton, Button } from 'antd';
import { FallOutlined, RiseOutlined, ExpandOutlined, VerticalAlignMiddleOutlined, PauseOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useMst } from '../models/Root';

const CPRStats = observer((props) => {
	const { tickers, cprStats, toggleCPRStatsPanel, cprStatsPanelVisible } = useMst((store) => ({
		tickers: store.tickers,
		cprStats: store.cprStats,
		toggleCPRStatsPanel: store.toggleCPRStatsPanel,
		cprStatsPanelVisible: store.cprStatsPanelVisible,
	}));

	if (!tickers || (tickers.length === 0 && cprStatsPanelVisible)) return <Skeleton />;

	const stats = cprStats(props.timeframe, props.futureMode);

	return (
		<>
			<Button style={{ marginBottom: 10 }} onClick={toggleCPRStatsPanel}>
				{cprStatsPanelVisible ? 'Hide Statistics' : 'Show Statistics'}
			</Button>

			<div>
				{cprStatsPanelVisible ? (
					<>
						<div className='site-statistic-demo-card'>
							<Row gutter={12}>
								<Col span={12}>
									<Card>
										<Statistic title='Untested CPR' value={stats.untestedCount} precision={0} valueStyle={{ color: 'black' }} prefix='🧲' suffix='' />
									</Card>
								</Col>
								<Col span={12}>
									<Card>
										<Statistic title='Neutral' value={stats.neutralCount} precision={0} valueStyle={{ color: 'gray' }} prefix={<PauseOutlined />} suffix='' />
									</Card>
								</Col>
								<Col span={12}>
									<Card>
										<Statistic title='Above CPR' value={stats.aboveCount} precision={0} valueStyle={{ color: '#3f8600' }} prefix={<RiseOutlined />} suffix='' />
									</Card>
								</Col>
								<Col span={12}>
									<Card>
										<Statistic title='Below CPR' value={stats.belowCount} precision={0} valueStyle={{ color: '#cf1322' }} prefix={<FallOutlined />} suffix='' />
									</Card>
								</Col>
								<Col span={12}>
									<Card>
										<Statistic title='CPR Width < 1%' value={stats.tightCount} precision={0} valueStyle={{ color: '#DF4294' }} prefix={<VerticalAlignMiddleOutlined />} suffix='' />
									</Card>
								</Col>
								<Col span={12}>
									<Card>
										<Statistic title='CPR Width > 1%' value={stats.wideCount} precision={0} valueStyle={{ color: '#2196F3' }} prefix={<ExpandOutlined />} suffix='' />
									</Card>
								</Col>
							</Row>
						</div>

						<div style={{ paddingTop: 10 }}>
							🐂 <font color='green'>Bulls {stats.bullsPercent.toFixed(1)}%</font> <b>vs</b> <font color='red'>{stats.bearsPercent.toFixed(1)}% Bears</font> 🐻
							<Progress percent={100} success={{ percent: stats.bullsPercent }} showInfo={false} strokeColor='red' />
						</div>
					</>
				) : null}
			</div>
		</>
	);
});

export default CPRStats;
