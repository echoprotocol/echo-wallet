/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
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
				<Segment>
					<Dimmer inverted active>
						<Loader inverted content="" />
					</Dimmer>
					{children}
				</Segment>

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
