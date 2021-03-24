import { Result, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { PropTypes } from 'prop-types';
import { useMst } from '../../../models/Root';
import { capitalizeFirstLetter } from '../../../lib/Helpers';
import { isValidMarket } from '../../../lib/Markets';
import CamTable from './tables/CamTable';
import ContentContainer from '../../layout/ContentContainer';

// TODO: Merge with CPRScreenerPage

const CamScreenerPage = ({ match }) => {
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
		<ContentContainer breadcrumbItems={['Camarilla Screener', capitalizeFirstLetter(market)]}>
			{!validMarket() ? (
				<Result status='404' title='404' subTitle='Sorry, the page you visited does not exist.' />
			) : (
				<>
					<Tabs defaultActiveKey='1'>
						<TabPane tab='Daily' key='1'>
							<CamTable timeframe='daily' market={market} futureMode={false} />
						</TabPane>
						<TabPane tab='Weekly' key='2'>
							<CamTable timeframe='weekly' market={market} futureMode={false} />
						</TabPane>
						<TabPane tab='Monthly' key='3'>
							<CamTable timeframe='monthly' market={market} futureMode={false} />
						</TabPane>
						<TabPane tab='Tomorrow' key='4'>
							<CamTable timeframe='daily' market={market} futureMode />
						</TabPane>
						<TabPane tab='Next Week' key='5'>
							<CamTable timeframe='weekly' market={market} futureMode />
						</TabPane>
						<TabPane tab='Next Month' key='6'>
							<CamTable timeframe='monthly' market={market} futureMode />
						</TabPane>
					</Tabs>
				</>
			)}
		</ContentContainer>
	);
};

CamScreenerPage.propTypes = {
	match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default observer(CamScreenerPage);
