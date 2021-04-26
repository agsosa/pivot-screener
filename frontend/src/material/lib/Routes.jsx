import ChartPage from 'material/pages/ChartPage';
import CalculatorPage from 'material/pages/CalculatorPage';
import ScreenerPage from 'material/pages/ScreenerPage';

export default [
  { path: '/calculator', component: CalculatorPage },
  { path: '/screener/:screenerType/:market', component: ScreenerPage },
  { path: '/', component: ChartPage },
];
