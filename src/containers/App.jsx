import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

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
		const { globalLoading, children } = this.props;
		return (
			<div className="global-wrapper">
				<Segment>
					{
						globalLoading ?
							<Dimmer inverted active>
								<Loader inverted content="" />
							</Dimmer> : children
					}
				</Segment>

				{this.renderModals()}
			</div>
		);
	}

}

App.propTypes = {
	globalLoading: PropTypes.bool.isRequired,
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
