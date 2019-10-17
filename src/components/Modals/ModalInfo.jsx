import React from 'react';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import classnames from 'classnames';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_INFO } from '../../constants/ModalConstants';

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
							<div className="info-value">1.4.4 <a href='#' target="_blank"> <span className="icon-commit" />k8b3c4e</a></div>
						</div>
						<div className="info-row">
							<div className="info-title">Website:</div>
							<div className="info-value"><a href="#" target="_blank">echo.org</a></div>
						</div>
						<div className="info-row">
							<div className="info-title">Privacy:</div>
							<div className="info-value">&#169; 2019 PixelPlex. All Rights Reserved</div>
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

