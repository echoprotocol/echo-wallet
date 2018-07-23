import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import Modals from '../components/Modals';

import { connection } from '../actions/GlobalActions';

import Loading from '../components/Loading/index';

class App extends React.Component {

	componentWillMount() {
		this.props.connection();
	}

	render() {
		const { globalLoading, children } = this.props;
		return (
			<div className="global-wrapper">
				<Segment>
					{
						globalLoading ?
							<Loading /> : children
					}
				</Segment>

				<Modals />
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
