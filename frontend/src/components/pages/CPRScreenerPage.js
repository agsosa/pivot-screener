import React, {useState, useEffect} from 'react';
import { Breadcrumb, Result, Badge, Space } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { capitalizeFirstLetter } from '../../utils/Helpers';
import { isValidMarket } from '../../utils/Markets';

import CPRStats from '../CPRStats';
import CPRTable from '../CPRTable';

export default function CPRScreenerPage(props) {
  const market = props.match.params.market;
  const valid_market = market && isValidMarket(market);

  useEffect(() => {

  }, []);

  return (
      <Content>
          <Breadcrumb style={{ margin: '16px 0', textAlign:'left'}}>
            <Breadcrumb.Item>CPR Screener</Breadcrumb.Item>
            <Breadcrumb.Item>{capitalizeFirstLetter(market)}</Breadcrumb.Item>
          </Breadcrumb>

          <div className="site-layout-background" style={{ padding: 24, minHeight: 360, textAlign: 'center', }}>
            { !valid_market ? <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist."/> : 
              (
                <>
                  <CPRStats />
                  
                  <Space><h1>Cryptocurrency / Binance Futures / Daily</h1> <Badge style={{backgroundColor:'#2196F3', marginBottom:7}} count={25} /></Space>
                  <CPRTable />
                </>
              )
            }
          </div>
    </Content>
  )
}