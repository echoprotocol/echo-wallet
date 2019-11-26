import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MODAL_WIPE } from '../../constants/ModalConstants';

import { closeModal } from '../../actions/ModalActions';
import { resetData } from '../../actions/GlobalActions';

class ModalWipeWallet extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			checked: false,
		};
	}

	onClose(e) {
		e.preventDefault();
		this.props.close();

		this.setState({ checked: false });
	}

	toggleChecked() {
		this.setState((prevState) => ({ ...prevState, checked: !prevState.checked }));
	}

	render() {
		const {
			show, loading,
		} = this.props;

		const { checked } = this.state;

		return (
			<Modal className="small wipe-data" open={show} dimmer="inverted">
				<div className="modal-content">

					<span
						className="icon-close"
						onClick={(e) => this.onClose(e)}
						onKeyDown={(e) => this.onClose(e)}
						role="button"
						tabIndex="0"
					/>
					<div className="modal-header" />
					<div className="modal-body">
						<div className="main-form">
							<div className="form-info">
								<h3>Your password cannot be restored</h3>
							</div>
							<div className="form-info-description">You can clear your account data from Echo Desktop and set a new password. If you do, you wil lose access to the accounts you’ve logged into. You will need to log into them again, after you have set a new password.</div>
							<div className="check-list">
								<div className="check">
									<input checked={checked} onChange={() => this.toggleChecked()} type="checkbox" id="wipe-agree" />
									<label className="label" htmlFor="wipe-agree">
										<span className="label-text">I understand the Echo Desktop does not store backups of my account keys, and I will lose access to them  by clearing my account data</span>
									</label>
								</div>
							</div>
							<div className="form-panel">
								<Button
									type="submit"
									className="main-btn"
									content="Clear data"
									onClick={this.props.wipe}
									disabled={loading || !checked}
								/>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalWipeWallet.propTypes = {
	show: PropTypes.bool,
	loading: PropTypes.bool,
	// error: PropTypes.string,
	wipe: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
};

ModalWipeWallet.defaultProps = {
	show: false,
	loading: false,
	// error: null,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_WIPE, 'show']),
		loading: state.modal.getIn([MODAL_WIPE, 'loading']),
		error: state.modal.getIn([MODAL_WIPE, 'error']),
	}),
	(dispatch) => ({
		wipe: () => dispatch(resetData()),
		close: () => dispatch(closeModal(MODAL_WIPE)),
	}),
)(ModalWipeWallet);
