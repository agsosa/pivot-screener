import { Layout } from "antd";
import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import LayoutFooter from "./LayoutFooter";
import LayoutHeader from "./LayoutHeader";
import "./MainLayout.css";
import CalculatorPage from "./pages/CalculatorPage";
import CamScreenerPage from "./pages/CamScreenerPage";
import ChartPage from "./pages/ChartPage";
import CPRScreenerPage from "./pages/CPRScreenerPage";
import ErrorPage from "./pages/ErrorPage";
import Sidebar from "./Sidebar";

const { Content } = Layout;

export default function MainLayout(props) {
	return (
		<Router>
			<Layout style={{ minHeight: "100vh" }}>
				<Sidebar />
				<Layout className="site-layout">
					<LayoutHeader />

					<Content style={{}}>
						<Switch>
							<Route exact path="/calculator" component={CalculatorPage} />
							<Route exact path="/cpr-screener/:market" component={CPRScreenerPage} />
							<Route exact path="/cam-screener/:market" component={CamScreenerPage} />
							<Route exact path="/" component={ChartPage} />
							<Route component={ErrorPage} />
						</Switch>
					</Content>

					<LayoutFooter />
				</Layout>
			</Layout>
		</Router>
	);
}
