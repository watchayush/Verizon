// test-utils.jsx
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from '@reduxjs/toolkit';
// Import your own reducer
import rootReducer from '../store/rootReducer';
import { preloadedState as localState } from '../store/index';

function render(
  ui,
  {
    preloadedState = {},
    store = configureStore({ reducer: rootReducer, preloadedState: { ...localState, ...preloadedState } }),
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

//Returns custom store reference
export function _createStore(obj) {
  const _redcuers = combineReducers({ ...obj });
  const _store = createStore(_redcuers, {});
  return _store;
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };