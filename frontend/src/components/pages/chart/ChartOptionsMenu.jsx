import React from 'react';
import { Button, Space, Switch } from 'antd';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../models/Root';

const ChartOptionsMenu = observer(() => {
	const { chartOptions } = useMst((store) => ({
		chartOptions: store.chartOptions,
	}));

	return (
		<Space direction='vertical'>
			<Space size={20}>
				<Button onClick={() => chartOptions.toggleAllDaily()}>Toggle Daily</Button>

				<Button onClick={() => chartOptions.toggleAllWeekly()}>Toggle Weekly</Button>

				<Button onClick={() => chartOptions.toggleAllMonthly()}>Toggle Monthly</Button>

				<span style={chartOptions.futureMode ? { fontWeight: 'bold', color: 'red' } : {}}>Show developing pivots: </span>
				<Switch
					size='small'
					checked={chartOptions.futureMode}
					onChange={(checked) => {
						chartOptions.setFutureMode(checked);
					}}
				/>
			</Space>
			<Space size={30}>
				<span>
					Daily CPR: <Switch size='small' checked={chartOptions.dailyCPR} onChange={(checked) => chartOptions.setDailyCPR(checked)} />
				</span>

				<span>
					Weekly CPR: <Switch size='small' checked={chartOptions.weeklyCPR} onChange={(checked) => chartOptions.setWeeklyCPR(checked)} />
				</span>
				<span>
					Monthly CPR: <Switch size='small' checked={chartOptions.monthlyCPR} onChange={(checked) => chartOptions.setMonthlyCPR(checked)} />
				</span>
			</Space>
			<Space size={30}>
				<span>
					Daily Camarilla: <Switch size='small' checked={chartOptions.dailyCam} onChange={(checked) => chartOptions.setDailyCam(checked)} />
				</span>
				<span>
					Weekly Camarilla: <Switch size='small' checked={chartOptions.weeklyCam} onChange={(checked) => chartOptions.setWeeklyCam(checked)} />
				</span>
				<span>
					Monthly Camarilla: <Switch size='small' checked={chartOptions.monthlyCam} onChange={(checked) => chartOptions.setMonthlyCam(checked)} />
				</span>
			</Space>
		</Space>
	);
});

export default ChartOptionsMenu;
