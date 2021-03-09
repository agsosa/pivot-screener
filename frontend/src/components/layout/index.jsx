import React from 'react';
import { Layout } from 'antd';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import LayoutFooter from './LayoutFooter';
import LayoutHeader from './LayoutHeader';
import CalculatorPage from '../pages/CalculatorPage';
import CamScreenerPage from '../pages/cam-screener/CamScreenerPage';
import ChartPage from '../pages/chart/ChartPage';
import CPRScreenerPage from '../pages/cpr-screener/CPRScreenerPage';
import ErrorPage from '../pages/ErrorPage';
import Sidebar from './Sidebar';
import './index.css';

const { Content } = Layout;

export default function MainLayout() {
	return (
		<Router>
			<Layout style={{ minHeight: '100vh' }}>
				<Sidebar />
				<Layout className='site-layout'>
					<LayoutHeader />

					<Content style={{}}>
						<Switch>
							<Route exact path='/calculator' component={CalculatorPage} />
							<Route exact path='/cpr-screener/:market' component={CPRScreenerPage} />
							<Route exact path='/cam-screener/:market' component={CamScreenerPage} />
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
