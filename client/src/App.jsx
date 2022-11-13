import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import ErrorPage from 'pages/ErrorPage';
import MainLayout from 'components/layout/MainLayout';
import Routes from 'lib/Routes';
import CustomTheme from 'lib/CustomTheme';
import { ThemeProvider } from '@material-ui/core/styles';

export default function App() {
  function AppContent() {
    return (
      <Switch>
        {Routes.map((route) => (
          <Route exact path={route.path} component={route.component} key={route.path} />
        ))}
        <Route component={ErrorPage} />
      </Switch>
    );
  }

  return (
    <Router>
      <ThemeProvider theme={CustomTheme}>
        <MainLayout Content={AppContent} />
      </ThemeProvider>
    </Router>
  );
}
