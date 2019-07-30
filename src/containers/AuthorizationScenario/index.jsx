import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';

import { MODAL_UNLOCK } from '../../constants/ModalConstants';
import { openModal, closeModal, setError } from '../../actions/ModalActions';
import { unlock } from '../../actions/AuthActions';

class AuthorizationScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	componentWillUnmount() {
		this.clear();
	}

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
		this.props.closeModal();
	}

	submit() {
		this.props.openModal();
	}

	change(value) {
		this.setState({ password: value });

		if (this.props.error) {
			this.props.clear();
		}
	}

	unlock() {
		const { password } = this.state;

		this.props.unlock(password, this.props.authorize);
	}

	close() {
		this.clear();
	}

	render() {
		const { password } = this.state;
		const { show, loading, error } = this.props;

		return (
			<React.Fragment>
				{this.props.children(this.submit.bind(this))}
				<ModalUnlock
					show={show}
					disabled={loading}
					password={password}
					error={error}
					change={(value) => this.change(value)}
					unlock={() => this.unlock()}
					close={() => this.close()}
				/>
			</React.Fragment>
		);
	}

}

AuthorizationScenario.propTypes = {
	children: PropTypes.func.isRequired,
	show: PropTypes.bool,
	loading: PropTypes.bool,
	error: PropTypes.string,
	authorize: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
};

AuthorizationScenario.defaultProps = {
	show: false,
	loading: false,
	error: null,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_UNLOCK, 'show']),
		loading: state.modal.getIn([MODAL_UNLOCK, 'loading']),
		error: state.modal.getIn([MODAL_UNLOCK, 'error']),
	}),
	(dispatch) => ({
		openModal: () => dispatch(openModal(MODAL_UNLOCK)),
		closeModal: () => dispatch(closeModal(MODAL_UNLOCK)),
		unlock: (value, callback) => dispatch(unlock(value, callback)),
		clear: () => dispatch(setError(MODAL_UNLOCK, null)),
	}),
)(AuthorizationScenario);
