import React, { useState } from 'react';
import { Layout, Breadcrumb } from 'antd';
import Sidebar from './Sidebar';
import './MainLayout.css';
import LayoutHeader from './LayoutHeader';
import LayoutFooter from './LayoutFooter';

const { Content } = Layout;

export default function MainLayout(props) {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout className="site-layout">
                <LayoutHeader />

                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    Bill is a cat.
                    </div>
                </Content>

                <LayoutFooter />

            </Layout>
        </Layout>
    );
}