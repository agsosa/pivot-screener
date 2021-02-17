import React from 'react';
import { Breadcrumb } from 'antd';
import { Content } from 'antd/lib/layout/layout';

export default function ChartPage(props) {
    return (
        <Content>
            <Breadcrumb style={{ margin: '16px 0', textAlign:'left'}}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Chart</Breadcrumb.Item>
            </Breadcrumb>

            <div className="site-layout-background" style={{ padding: 24, minHeight: 360, textAlign: 'center', }}>

            </div>
      </Content>
    )
}