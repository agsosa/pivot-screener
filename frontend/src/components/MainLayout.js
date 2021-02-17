import React from 'react';
import { Layout } from 'antd';
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
import ChartPage from './pages/ChartPage';
import CPRScreenerPage from './pages/CPRScreenerPage';
import CamScreenerPage from './pages/CamScreenerPage';
import ErrorPage from './pages/ErrorPage';

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
                                <Route exact path="/cpr-screener/:market" component={CPRScreenerPage} />
                                <Route exact path="/cam-screener/:market" component={CamScreenerPage} />
                                <Route exact path="/" component={ChartPage} />
                                <Route component={ErrorPage}/>
                            </Switch>
                            
                    </Content>

                    <LayoutFooter />

                </Layout>
            </Layout>
        </Router>
    );
}