import React, {useState, useEffect} from 'react';
import { Card, Statistic, Row, Col, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, PauseOutlined } from '@ant-design/icons';

export default function CPRStats(props) {

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
        </div>
    </>
  )
}