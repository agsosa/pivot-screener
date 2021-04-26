import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import ErrorPage from 'material/pages/ErrorPage';
import Content from 'material/components/layout/Content';
import Footer from 'material/components/layout/Footer';
import Header from 'material/components/layout/Header';
import Routes from 'material/lib/Routes';

export default function App() {
  return (
    <Router>
      <Header />
      <Content>
        <Switch>
          {Routes.map((route) => (
            <Route exact path={route.path} component={route.component} key={route.path} />
          ))}
          <Route component={ErrorPage} />
        </Switch>
      </Content>
      <Footer />
    </Router>
  );
}
