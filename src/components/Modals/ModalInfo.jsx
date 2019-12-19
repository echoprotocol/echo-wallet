/* eslint-disable no-undef */
import React from 'react';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import { version } from '../../../package.json';
import { closeModal } from '../../actions/ModalActions';
import { MODAL_INFO } from '../../constants/ModalConstants';
import { GIT_REF, ECHO_REF } from '../../constants/GlobalConstants';

class ModalInfoWallet extends React.Component {

	onClose(e) {
		e.preventDefault();
		this.props.close();
	}

	goToExternalLink(e, link) {
		if (ELECTRON && window.shell) {
			e.preventDefault();
			window.shell.openExternal(link);
		}
	}

	render() {
		const { show, intl } = this.props;
		const commithash = ''.concat(COMMITHASH);
		return (
			<Modal className="small" open={show}>
				<FocusLock autoFocus={false}>
					<div className="modal-content info">
						<button
							className="icon-close"
							onClick={(e) => this.onClose(e)}
						/>
						<div className="modal-header">
							{intl.formatMessage({ id: 'modals.modal_info.title' })}
						</div>
						<div className="modal-body">
							<div className="info-row">
								<div className="info-title">{intl.formatMessage({ id: 'modals.modal_info.version' })}</div>
								<div className="info-value">{version}
									{
										commithash &&
											<a
												href={`${GIT_REF}${commithash}`}
												target="_blank"
												rel="noreferrer noopener"
												onClick={(e) => this.goToExternalLink(e, `${GIT_REF}${commithash}`)}
											>
												<span className="icon-commit" />
												<span>{commithash.substring(0, 7)}</span>
											</a>
									}
								</div>
							</div>
							<div className="info-row">
								<div className="info-title">{intl.formatMessage({ id: 'modals.modal_info.website' })}</div>
								<div className="info-value">
									<a
										href={ECHO_REF}
										target="_blank"
										rel="noreferrer noopener"
										onClick={(e) => this.goToExternalLink(e, ECHO_REF)}
									>
										{intl.formatMessage({ id: 'modals.modal_info.link' })}
									</a>
								</div>
							</div>
							<div className="info-row">
								<div className="info-title">{intl.formatMessage({ id: 'modals.modal_info.privacy' })}</div>
								<div className="info-value">&#169; {(new Date()).getFullYear()}
									{intl.formatMessage({ id: 'modals.modal_info.pixelplex_rights' })}
								</div>
							</div>
						</div>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}

ModalInfoWallet.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalInfoWallet.defaultProps = {
	show: false,
};


export default injectIntl(connect(
	(state) => ({
		show: state.modal.getIn([MODAL_INFO, 'show']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_INFO)),
	}),
)(ModalInfoWallet));

