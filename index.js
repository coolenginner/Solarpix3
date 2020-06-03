/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import AsyncStorage from '@react-native-community/async-storage';

setLocalStorage = async (value) => {
  try {
    const localState = JSON.stringify(value);
    await AsyncStorage.setItem('state', localState);
  } 
  catch (error) {
    console.log(error);
  }
};

const persistedState = {};
console.disableYellowBox = true;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  persistedState,
  composeEnhancers(
    applyMiddleware(reduxThunk),
    offline(offlineConfig)
  )
);

store.subscribe(() => {
  setLocalStorage({
    uploadingStatus:store.getState().uploadingStatus,
    userData: store.getState().userData,
    sessions: store.getState().sessions,
    jobMeta: store.getState().jobMeta,
    db: store.getState().db
  });
});

const RNRedux = () => (
  <Provider store = { store }>
    <App />
  </Provider>
)

AppRegistry.registerComponent(appName, () => RNRedux);
