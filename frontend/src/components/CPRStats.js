import React, {useState, useEffect} from 'react';
import { Card, Statistic, Row, Col, Progress, Space, Badge } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, PauseOutlined } from '@ant-design/icons';
import { useMst } from '../models/Root';
import { observer } from "mobx-react-lite"
import moment from 'moment';
import { autorun } from "mobx"
import { calcPercent } from '../utils/Helpers'

const CPRStats = observer((props) => {
    const { tickers, cprUntestedCount, cprNeutralCount, cprBelowCount, cprAboveCount } = useMst(store => ({
        tickers: store.tickers,
        cprUntestedCount: store.cprUntestedCount,
        cprNeutralCount: store.cprNeutralCount,
        cprBelowCount: store.cprBelowCount,
        cprAboveCount: store.cprAboveCount,
    }));

  return (<>
        <div className="site-statistic-demo-card">
            <Row gutter={16}>
            <Col span={12}>
                <Card>
                <Statistic
                    title="Untested CPR"
                    value={cprUntestedCount}
                    precision={0}
                    valueStyle={{ color: 'black' }}
                    prefix={"🧲"}
                    suffix=""
                />
                </Card>
            </Col>
            <Col span={12}>
                <Card>
                <Statistic
                    title="Neutral"
                    value={cprNeutralCount}
                    precision={0}
                    valueStyle={{ color: 'gray' }}
                    prefix={<PauseOutlined />}
                    suffix=""
                />
                </Card>
            </Col>
            <Col span={12}>
                <Card>
                <Statistic
                    title="Above CPR"
                    value={cprAboveCount}
                    precision={0}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<ArrowUpOutlined />}
                    suffix=""
                />
                </Card>
            </Col>
            <Col span={12}>
                <Card>
                <Statistic
                    title="Below CPR"
                    value={cprBelowCount}
                    precision={0}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<ArrowDownOutlined />}
                    suffix=""
                />
                </Card>
            </Col>
            </Row>
        </div>
        
        <div style={{paddingTop:10}}>
        🐂 <font color="green">Bulls {calcPercent(cprAboveCount, cprAboveCount+cprBelowCount).toFixed(1)}%</font> <b>vs</b> <font color="red">{calcPercent(cprBelowCount, cprAboveCount+cprBelowCount).toFixed(1)}% Bears</font> 🐻
        <Progress percent={100} success={{ percent: calcPercent(cprAboveCount, cprAboveCount+cprBelowCount) }} showInfo={false} strokeColor="red" />
        <br />
        
        Candle close in <br />

        <Space><h1>Cryptocurrency / Binance Futures / Daily</h1> <Badge style={{backgroundColor:'#2196F3', marginBottom:7}} count={tickers.length} /></Space>
        </div>
    </>
  )
})

export default CPRStats;