import React, { useState } from 'react';
import { Layout, Breadcrumb } from 'antd';
import Sidebar from './Sidebar';
import './MainLayout.css';
import LayoutHeader from './LayoutHeader';
import LayoutFooter from './LayoutFooter';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";

import CalculatorPage from './pages/CalculatorPage';

const { Content } = Layout;

export default function MainLayout(props) {
    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout className="site-layout">
                    <LayoutHeader />

                    <Content style={{ margin: '0 16px' }}>
                            <Switch>
                                <Route exact path="/calculator" component={CalculatorPage} />
                                <Route exact path="/cpr-screener/:market" component={null} />
                                <Route exact path="/" component={null} />
                            </Switch>
                            
                    </Content>

                    <LayoutFooter />

                </Layout>
            </Layout>
        </Router>
    );
}