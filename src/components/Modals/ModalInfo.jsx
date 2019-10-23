import React from 'react';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { version } from '../../../package.json';
import { closeModal } from '../../actions/ModalActions';
import { MODAL_INFO } from '../../constants/ModalConstants';
import { GIT_REF, ECHO_REF } from '../../constants/GlobalConstants';

class ModalInfoWallet extends React.Component {

	onClose(e) {
		e.preventDefault();
		this.props.close();
	}

	render() {
		const { show } = this.props;

		return (
			<Modal className="small unclock-size" open={show} dimmer="inverted">
				<div className="modal-content info">
					<span
						className="icon-close"
						onClick={(e) => this.onClose(e)}
						onKeyDown={(e) => this.onClose(e)}
						role="button"
						tabIndex="0"
					/>
					<div className="modal-header"> Echo Desktop Wallet</div>
					<div className="modal-body">
						<div className="info-row">
							<div className="info-title">Version:</div>
							<div className="info-value">{version}
								{/* eslint-disable-next-line no-undef */}
								<a href={`${GIT_REF}${COMMITHASH}`} target="_blank" rel="noreferrer noopener">
									{/* eslint-disable-next-line no-undef */}
									<span className="icon-commit">{COMMITHASH.substring(0, 7)} </span>
								</a>
							</div>
						</div>
						<div className="info-row">
							<div className="info-title">Website:</div>
							<div className="info-value">
								<a href={ECHO_REF} target="_blank" rel="noreferrer noopener">echo.org</a>
							</div>
						</div>
						<div className="info-row">
							<div className="info-title">Privacy:</div>
							<div className="info-value">&#169; {(new Date()).getFullYear()} PixelPlex. All Rights Reserved</div>
						</div>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalInfoWallet.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
};

ModalInfoWallet.defaultProps = {
	show: false,
};


export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_INFO, 'show']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_INFO)),
	}),
)(ModalInfoWallet);

