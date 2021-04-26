import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, rootStore } from 'models/Root';
import App from 'material/lib/App';

ReactDOM.render(
  <React.StrictMode>
    <Provider value={rootStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
