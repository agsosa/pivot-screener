import { Result, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { PropTypes } from 'prop-types';
import { useMst } from '../../../models/Root';
import { capitalizeFirstLetter } from '../../../lib/Helpers';
import { isValidMarket } from '../../../lib/Markets';
import CPRTable from '../../tables/CPRTable';
import ContentContainer from '../../layout/ContentContainer';

// TODO: Merge with CamScreenerPage

const CPRScreenerPage = ({ match }) => {
	const { market } = match.params;
	const validMarket = () => market && isValidMarket(market);
	const { TabPane } = Tabs;

	const { startReceivingData, stopReceivingData } = useMst((store) => ({
		startReceivingData: store.startReceivingData,
		stopReceivingData: store.stopReceivingData,
	}));

	useEffect(() => {
		if (validMarket()) {
			startReceivingData('daily, weekly, monthly', market);
		}

		return () => {
			stopReceivingData();
		};
	}, [market]);

	return (
		<ContentContainer breadcrumbItems={['CPR Screener', capitalizeFirstLetter(market)]}>
			{!validMarket() ? (
				<Result status='404' title='404' subTitle='Sorry, the page you visited does not exist.' />
			) : (
				<>
					<Tabs defaultActiveKey='1'>
						<TabPane tab='Daily' key='1'>
							<CPRTable timeframe='daily' market={market} futureMode={false} />
						</TabPane>
						<TabPane tab='Weekly' key='2'>
							<CPRTable timeframe='weekly' market={market} futureMode={false} />
						</TabPane>
						<TabPane tab='Monthly' key='3'>
							<CPRTable timeframe='monthly' market={market} futureMode={false} />
						</TabPane>
						<TabPane tab='Tomorrow' key='4'>
							<CPRTable timeframe='daily' market={market} futureMode />
						</TabPane>
						<TabPane tab='Next Week' key='5'>
							<CPRTable timeframe='weekly' market={market} futureMode />
						</TabPane>
						<TabPane tab='Next Month' key='6'>
							<CPRTable timeframe='monthly' market={market} futureMode />
						</TabPane>
					</Tabs>
				</>
			)}
		</ContentContainer>
	);
};

CPRScreenerPage.propTypes = {
	match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default observer(CPRScreenerPage);
