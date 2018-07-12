import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ModalConfirm } from '../components/Modals';

class App extends React.Component {

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
};

export default connect((state) => ({
	globalLoading: state.global.get('globalLoading'),
	loading: state.global.get('loading'),
}))(App);
