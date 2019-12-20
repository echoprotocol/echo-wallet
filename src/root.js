// @flow
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import Routes from './routes';
import { initApp } from './actions/GlobalActions';


export default class Root extends Component {

	componentDidMount() {
		const { store } = this.props;
		store.dispatch(initApp(store));
	}

	render() {
		const { store, history } = this.props;

		return (
			<Provider store={store}>
				{/* ConnectedRouter will use the store from Provider automatically */}
				<ConnectedRouter history={history}>
					<div>
						<Routes />
					</div>
				</ConnectedRouter>
			</Provider>
		);
	}

}
