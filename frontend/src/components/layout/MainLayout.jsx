import React from 'react';
import { Layout } from 'antd';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import LayoutFooter from 'components/layout/Footer';
import LayoutHeader from 'components/layout/Header';
import CalculatorPage from 'pages/CalculatorPage';
import ScreenerPage from 'pages/screeners/ScreenerPage';
import ChartPage from 'pages/chart/ChartPage';
import ErrorPage from 'pages/ErrorPage';
import Sidebar from 'components/layout/Sidebar';
import './MainLayout.css';

const { Content } = Layout;

export default function MainLayout() {
  return (
    <Router>
      <Layout className='main-layout'>
        <Sidebar />
        <Layout className='site-layout'>
          <LayoutHeader />

          <Content style={{}}>
            <Switch>
              <Route exact path='/calculator' component={CalculatorPage} />
              <Route exact path='/screener/:screenerType/:market' component={ScreenerPage} />
              <Route exact path='/screener/:screenerType/:market' component={ScreenerPage} />
              <Route exact path='/' component={ChartPage} />
              <Route component={ErrorPage} />
            </Switch>
          </Content>

          <LayoutFooter />
        </Layout>
      </Layout>
    </Router>
  );
}
