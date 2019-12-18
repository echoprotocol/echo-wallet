import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalUnlock from '../../components/Modals/ModalUnlock';

import { MODAL_UNLOCK, MODAL_WIPE } from '../../constants/ModalConstants';

import { openModal, closeModal, setError } from '../../actions/ModalActions';
import { unlock } from '../../actions/AuthActions';

class UnlockScenario extends React.Component {

	constructor(props) {
		super(props);

		this.DEFAULT_STATE = {
			password: '',
			modalType: '',
		};

		this.state = _.cloneDeep(this.DEFAULT_STATE);
	}

	componentWillUnmount() {
		this.clear();
	}

	clear() {
		this.setState(_.cloneDeep(this.DEFAULT_STATE));
	}

	async submit(modalType) {
		this.setState({ modalType: `${MODAL_UNLOCK}${modalType}` });
		this.props.openModal(`${MODAL_UNLOCK}${modalType}`);
	}

	change(password) {
		this.setState({ password });

		if (this.props[MODAL_UNLOCK].getIn([this.state.modalType, 'error'])) {
			this.props.clearError(this.state.modalType);
		}
	}

	unlock() {
		const { password } = this.state;

		this.props.unlock(password, () => {
			this.props.closeModal(this.state.modalType);
			this.props.onUnlock(password);
			this.clear();
		});
	}

	close(modal) {
		this.clear();
		this.props.closeModal(modal);
	}

	forgot() {
		this.clear();
		this.props.closeModal(this.state.modalType);
		this.props.openModal(MODAL_WIPE);
	}

	renderUnlock() {
		let { [MODAL_UNLOCK]: modalUnlock } = this.props;
		if (!this.state.modalType || !modalUnlock.get(this.state.modalType)) {
			return null;
		}
		modalUnlock = modalUnlock.get(this.state.modalType);
		return (
			<ModalUnlock
				show={modalUnlock.get('show')}
				disabled={modalUnlock.get('loading')}
				error={modalUnlock.get('error')}
				password={this.state.password}
				change={(value) => this.change(value)}
				unlock={() => this.unlock()}
				forgot={() => this.forgot()}
				close={() => this.close(this.state.modalType)}
			/>
		);
	}

	render() {
		const { key } = this.props;
		return (
			<React.Fragment key={key}>
				{this.props.children(this.submit.bind(this))}
				{this.renderUnlock()}
			</React.Fragment>
		);
	}

}

UnlockScenario.propTypes = {
	onUnlock: PropTypes.func,
	onSuccess: PropTypes.func,
	children: PropTypes.func.isRequired,

	key: PropTypes.string,
	[MODAL_UNLOCK]: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	closeModal: PropTypes.func.isRequired,
	clearError: PropTypes.func.isRequired,
	unlock: PropTypes.func.isRequired,
};

UnlockScenario.defaultProps = {
	key: '',
	onUnlock: () => {},
	onSuccess: () => {},
};

export default connect(
	(state) => ({
		[MODAL_UNLOCK]: state.modal,
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
		closeModal: (value) => dispatch(closeModal(value)),
		clearError: (value) => dispatch(setError(value, null)),
		unlock: (password, callback) => dispatch(unlock(password, callback)),
	}),
)(UnlockScenario);
