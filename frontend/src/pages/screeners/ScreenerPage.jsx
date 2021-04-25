import { Result, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { PropTypes } from 'prop-types';
import { useMst } from 'models/Root';
import { capitalizeFirstLetter } from 'lib/Helpers';
import { isValidMarket } from 'lib/Markets';
import CamTable from 'pages/screeners/tables/CamTable';
import ContentContainer from 'components/layout/ContentContainer';
import CPRTable from 'pages/screeners/tables/CPRTable';

const ScreenerPage = ({ match }) => {
  const { market, screenerType } = match.params;

  const validMarket = () => market && isValidMarket(market);

  let TableComponent;
  let breadcrumbStr;

  switch (screenerType.toLowerCase()) {
    case 'cpr':
      TableComponent = CPRTable;
      breadcrumbStr = 'CPR Screener';
      break;
    case 'camarilla':
      TableComponent = CamTable;
      breadcrumbStr = 'Camarilla Screener';
      break;
    default:
      TableComponent = null;
      breadcrumbStr = 'Error';
  }

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
    <ContentContainer breadcrumbItems={[breadcrumbStr, capitalizeFirstLetter(market)]}>
      {!validMarket() || !TableComponent ? (
        <Result status='404' title='404' subTitle='Sorry, the page you visited does not exist.' />
      ) : (
        <>
          <Tabs defaultActiveKey='1'>
            <TabPane tab='Daily' key='1'>
              <TableComponent screenerType={screenerType} timeframe='daily' market={market} futureMode={false} />
            </TabPane>
            <TabPane tab='Weekly' key='2'>
              <TableComponent screenerType={screenerType} timeframe='weekly' market={market} futureMode={false} />
            </TabPane>
            <TabPane tab='Monthly' key='3'>
              <TableComponent screenerType={screenerType} timeframe='monthly' market={market} futureMode={false} />
            </TabPane>
            <TabPane tab='Tomorrow' key='4'>
              <TableComponent screenerType={screenerType} timeframe='daily' market={market} futureMode />
            </TabPane>
            <TabPane tab='Next Week' key='5'>
              <TableComponent screenerType={screenerType} timeframe='weekly' market={market} futureMode />
            </TabPane>
            <TabPane tab='Next Month' key='6'>
              <TableComponent screenerType={screenerType} timeframe='monthly' market={market} futureMode />
            </TabPane>
          </Tabs>
        </>
      )}
    </ContentContainer>
  );
};

ScreenerPage.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default observer(ScreenerPage);
