import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actions as EchoJSActions } from 'echojs-redux';

import { ModalConfirm } from '../components/Modals';

class App extends React.Component {

	componentWillMount() {
		this.props.connect();
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
	connect: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		globalLoading: state.global.get('globalLoading'),
		loading: state.global.get('loading'),
	}),
	(dispatch) => ({
		connect: () => dispatch(EchoJSActions.connect()),
	}),
)(App);
