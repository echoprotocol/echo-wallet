import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import { PERMISSIONS_PATH } from '../../constants/RouterConstants';
import { PROPOSAL_ADD_WIF } from '../../constants/ModalConstants';
import { closeModal } from '../../actions/ModalActions';

class ModalWIF extends React.Component {

	onAgree(e) {
		e.preventDefault();
		this.props.history.push(PERMISSIONS_PATH);
		this.props.hide();
	}
	onClose(e) {
		e.preventDefault();
		this.props.hide();
	}

	render() {
		const { show, intl } = this.props;

		return (
			<Modal className="small" open={show}>
				<FocusLock autoFocus={false}>
					<div className="modal-content add-key">
						<div className="modal-header">
							{intl.formatMessage({ id: 'modals.modal_add_proposal_wif.title' })}
						</div>
						<div className="modal-body">
							<div className="info-text">
								{intl.formatMessage({ id: 'modals.modal_add_proposal_wif.text_pt1' })}
								<br />
								{intl.formatMessage({ id: 'modals.modal_add_proposal_wif.text_pt2' })}
							</div>
							<div className="form-panel">
								<Button
									type="button"
									className="main-btn"
									onClick={(e) => this.onClose(e)}
									content={intl.formatMessage({ id: 'modals.modal_add_proposal_wif.later_button_text' })}
								/>
								<Button
									type="button"
									className="main-btn"
									onClick={(e) => this.onAgree(e)}
									content={intl.formatMessage({ id: 'modals.modal_add_proposal_wif.confirm_button_text' })}
								/>
							</div>
						</div>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}

ModalWIF.propTypes = {
	show: PropTypes.bool,
	hide: PropTypes.func.isRequired,
	history: PropTypes.any.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalWIF.defaultProps = {
	show: false,
};

export default injectIntl(withRouter(connect(
	(state) => ({
		show: state.modal.getIn([PROPOSAL_ADD_WIF, 'show']),
	}),
	(dispatch) => ({
		hide: () => dispatch(closeModal(PROPOSAL_ADD_WIF)),
	}),
)(ModalWIF)));
