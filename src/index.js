import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { VDSManager } from '@vds/utilities';
import ErrorBoundary from './errorBoundary';
import App from './app';
import Toasts from './components/organisms/toasts';
import store from './store';
// import { injectStore } from './services/API';
import './styles/style.css';
import Interceptor from './services/interceptor';

Interceptor(store);

// injectStore(store);

ReactDOM.render(
  <React.StrictMode>
    <VDSManager />
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root'),
);