// TODO: Add babel https://material-ui.com/es/guides/minimizing-bundle-size/

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, rootStore } from 'models/Root';
import App from 'material/lib/App';
import CssBaseline from '@material-ui/core/CssBaseline';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Provider value={rootStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
