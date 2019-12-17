import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

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
			show, loading, intl,
		} = this.props;

		const { checked } = this.state;

		return (
			<Modal className="small wipe-data" open={show}>
				<FocusLock autoFocus={false}>
					<div className="modal-content">
						<button
							className="icon-close"
							onClick={(e) => this.onClose(e)}
						/>
						<div className="modal-header" />
						<div className="modal-body">
							<div className="main-form">
								<div className="form-info">
									<h3>
										{intl.formatMessage({ id: 'modals.modal_wipe.title' })}
									</h3>
								</div>
								<div className="form-info-description">
									{intl.formatMessage({ id: 'modals.modal_wipe.text' })}
								</div>
								<div className="check-list">
									<div className="check">
										<input
											checked={checked}
											onChange={() => this.toggleChecked()}
											type="checkbox"
											id="wipe-agree"
										/>
										<label className="label" htmlFor="wipe-agree">
											<span className="label-text">
												{intl.formatMessage({ id: 'modals.modal_wipe.checkbox_text' })}
											</span>
										</label>
									</div>
								</div>
								<div className="form-panel">
									<Button
										type="submit"
										className="main-btn"
										content={intl.formatMessage({ id: 'modals.modal_wipe.confirm_button_text' })}
										onClick={this.props.wipe}
										disabled={loading || !checked}
									/>
								</div>
							</div>
						</div>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}

ModalWipeWallet.propTypes = {
	show: PropTypes.bool,
	loading: PropTypes.bool,
	wipe: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalWipeWallet.defaultProps = {
	show: false,
	loading: false,
};

export default injectIntl(connect(
	(state) => ({
		show: state.modal.getIn([MODAL_WIPE, 'show']),
		loading: state.modal.getIn([MODAL_WIPE, 'loading']),
	}),
	(dispatch) => ({
		wipe: () => dispatch(resetData()),
		close: () => dispatch(closeModal(MODAL_WIPE)),
	}),
)(ModalWipeWallet));
