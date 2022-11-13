import ChartPage from 'pages/ChartPage';
import CalculatorPage from 'pages/CalculatorPage';
import ScreenerPage from 'pages/ScreenerPage';

export default [
  { path: '/calculator', component: CalculatorPage },
  { path: '/screener/:screenerType/:market', component: ScreenerPage },
  { path: '/', component: ChartPage },
];
