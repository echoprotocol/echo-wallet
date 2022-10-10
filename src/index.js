import thunk from 'redux-thunk';
import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';

import { echoReducer } from 'echojs-lib';

import { routerMiddleware, routerReducer } from 'react-router-redux';

import reducers from './reducers';
import history from './history';
import './assets/loader';
import Root from './root';
console.log('hello!');

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
	combineReducers({
		...reducers,
		router: routerReducer,
		echojs: echoReducer(),
	}), {},
	compose(
		applyMiddleware(thunk),
		applyMiddleware(middleware),
		window.devToolsExtension ? window.devToolsExtension() : (f) => f,
	),
);

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))

ReactDOM.render(
	<Root store={store} history={history} />,
	document.getElementById('root'),
);
