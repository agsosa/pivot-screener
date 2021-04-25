import React from 'react';
import { Card, Statistic, Row, Col, Progress, Skeleton, Button } from 'antd';
import { FallOutlined, RiseOutlined, ExclamationCircleOutlined, ColumnHeightOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { PropTypes } from 'prop-types';
import { useMst } from 'models/Root';
import './Stats.css';

const CamStats = observer(({ timeframe, futureMode }) => {
  const { tickers, toggleCamStatsPanel, camStatsPanelVisible, camStats } = useMst((store) => ({
    tickers: store.tickers,
    toggleCamStatsPanel: store.toggleCamStatsPanel,
    camStatsPanelVisible: store.camStatsPanelVisible,
    camStats: store.camStats,
  }));

  if (!tickers || (tickers.length === 0 && camStatsPanelVisible)) return <Skeleton />;

  const stats = camStats(timeframe, futureMode);

  return (
    <div>
      <Button className='btn' onClick={toggleCamStatsPanel}>
        {camStatsPanelVisible ? 'Hide Statistics' : 'Show Statistics'}
      </Button>

      {camStatsPanelVisible ? (
        <div>
          <div className='site-statistic-demo-card'>
            <Row gutter={12}>
              <Col span={12}>
                <Card>
                  <Statistic
                    title='Above H4'
                    value={stats.aboveH4}
                    precision={0}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<RiseOutlined />}
                    suffix=''
                  />
                </Card>
              </Col>

              <Col span={12}>
                <Card>
                  <Statistic
                    title='Below L4'
                    value={stats.belowL4}
                    precision={0}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<FallOutlined />}
                    suffix=''
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title='Above H3'
                    value={stats.aboveH3}
                    precision={0}
                    valueStyle={{ color: 'orange' }}
                    prefix={<ExclamationCircleOutlined />}
                    suffix=''
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title='Below L3'
                    value={stats.belowL3}
                    precision={0}
                    valueStyle={{ color: 'orange' }}
                    prefix={<ExclamationCircleOutlined />}
                    suffix=''
                  />
                </Card>
              </Col>
              <Col span={24}>
                <Card>
                  <Statistic
                    title='Between L3 and H3'
                    value={stats.betweenL3H3}
                    precision={0}
                    valueStyle={{ color: 'gray' }}
                    prefix={<ColumnHeightOutlined />}
                    suffix=''
                  />
                </Card>
              </Col>
            </Row>
          </div>

          <div className='progress-bar-container'>
            🐂 <font color='green'>Bulls {stats.bullsPercent.toFixed(1)}%</font> <b>vs</b>{' '}
            <font color='red'>{stats.bearsPercent.toFixed(1)}% Bears</font> 🐻
            <Progress
              percent={100}
              success={{ percent: stats.bullsPercent }}
              showInfo={false}
              strokeColor={stats.bearsPercent === 0 && stats.bullsPercent === 0 ? 'gray' : 'red'}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
});

CamStats.propTypes = {
  futureMode: PropTypes.bool.isRequired,
  timeframe: PropTypes.string.isRequired,
};

export default CamStats;
