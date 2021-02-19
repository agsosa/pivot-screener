import React, {useState, useEffect} from 'react';
import { Card, Statistic, Row, Col, Progress, Space, Badge } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, PauseOutlined } from '@ant-design/icons';
import { useMst } from '../models/Root';
import { observer } from "mobx-react-lite"

const CPRStats = observer((props) => {
    const { tickers, test, fetchTickers } = useMst(store => ({
        tickers: store.tickers,
        test: store.test,
        fetchTickers: store.fetchTickers,
    }));

    useEffect(() => {
        console.log("hola")
        fetchTickers();
    }, [])

  return (<>
            <div className="site-statistic-demo-card">
                <Row gutter={16}>
                <Col span={12}>
                    <Card>
                    <Statistic
                        title="Untested CPR"
                        value={25}
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
                        value={1}
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
                        value={3}
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
                        value={5}
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
        🐂 <font color="green">Bulls 50%</font> <b>vs</b> <font color="red">50% Bears</font> 🐻
        <Progress percent={100} success={{ percent: 50 }} showInfo={false} strokeColor="red" />
        <br />
        Candle close in {tickers[0].candlesticks.dailyCandles[0].time}<br />
        <Space><h1>Cryptocurrency / Binance Futures / Daily</h1> <Badge style={{backgroundColor:'#2196F3', marginBottom:7}} count={tickers.length} /></Space>
        </div>
    </>
  )
})

export default CPRStats;