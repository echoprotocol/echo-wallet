/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ModalConfirm } from '../components/Modals';

import { connection } from '../actions/GlobalActions';

class App extends React.Component {

	componentWillMount() {
		this.props.connection();
	}

	renderModals() {
		return (
			<div>
				<ModalConfirm />
			</div>
		);
	}

	render() {
		const { children } = this.props;
		return (
			<div className="global-wrapper">

				{children}

				{this.renderModals()}
			</div>
		);
	}

}

App.propTypes = {
	children: PropTypes.element.isRequired,
	connection: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		globalLoading: state.global.get('globalLoading'),
		loading: state.global.get('loading'),
	}),
	(dispatch) => ({
		connection: () => dispatch(connection()),
	}),
)(App);
