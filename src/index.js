/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import thunk from 'redux-thunk';
import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import { Provider } from 'react-redux';

import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux';
import { EchoJSReducer } from 'echojs-redux';

import reducers from './reducers';
import Routes from './routes'; // Or wherever you keep your reducers
import history from './history';
import './assets/loader';


// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
	combineReducers({
		...reducers,
		router: routerReducer,
		echojs: EchoJSReducer.reducer,
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
	<Provider store={store}>
		{/* ConnectedRouter will use the store from Provider automatically */}
		<ConnectedRouter history={history}>
			<div>
				<Routes />
			</div>
		</ConnectedRouter>
	</Provider>,
	document.getElementById('root'),
);
