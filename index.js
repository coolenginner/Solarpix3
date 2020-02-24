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
import { getLocalStorage, setLocalStorage } from './localStorage';
// import { offline } from '@redux-offline/redux-offline';
// import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

// const persistedState = getLocalStorage();
// // This context need to debug react native code
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = createStore(
//   reducers,
//   persistedState,
//   composeEnhancers(
//     applyMiddleware(reduxThunk)
//   )
// );

// //Need to save state anytime the store state changes
// store.subscribe(() => {
//   setLocalStorage({
//     userData: store.getState().userData,
//     sessions: store.getState().sessions,
//     jobMeta: store.getState().jobMeta,
//     db: store.getState().db
//   });
// });

// const RNRedux = () => (
//   <Provider store = { store }>
//     <App />
//   </Provider>
// )

// AppRegistry.registerComponent(appName, () => RNRedux);
AppRegistry.registerComponent(appName, () => App);
