import React from 'react';
import { Breadcrumb, Result } from 'antd';
import { Content } from 'antd/lib/layout/layout';

export default function ErrorPage(props) {
  return (
      <Content>
          <Breadcrumb style={{ margin: '16px 0', textAlign:'left'}}>
            <Breadcrumb.Item>Pivot Screener</Breadcrumb.Item>
            <Breadcrumb.Item>Error 404</Breadcrumb.Item>
          </Breadcrumb>

          <div className="site-layout-background" style={{ padding: 24, minHeight: 360, textAlign: 'center', }}>
            <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist."/> 
          </div>
    </Content>
  )
}