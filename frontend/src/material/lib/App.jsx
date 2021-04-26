import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import ErrorPage from 'material/pages/ErrorPage';
import MainLayout from 'material/components/layout/MainLayout';
import Routes from 'material/lib/Routes';
import CustomTheme from 'material/lib/CustomTheme';
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
