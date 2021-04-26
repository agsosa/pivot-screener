import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import ChartPage from 'material/pages/ChartPage';
import CalculatorPage from 'material/pages/CalculatorPage';
import ScreenerPage from 'material/pages/ScreenerPage';
import ErrorPage from 'material/pages/ErrorPage';
import Content from 'material/components/layout/Content';
import Footer from 'material/components/layout/Footer';
import Header from 'material/components/layout/Header';

export default function App() {
  return (
    <Router>
      <Content />
      <Content>
        <Switch>
          <Route exact path='/calculator' component={CalculatorPage} />
          <Route exact path='/screener/:screenerType/:market' component={ScreenerPage} />
          <Route exact path='/screener/:screenerType/:market' component={ScreenerPage} />
          <Route exact path='/' component={ChartPage} />
          <Route component={ErrorPage} />
        </Switch>
      </Content>
      <Footer />
    </Router>
  );
}
