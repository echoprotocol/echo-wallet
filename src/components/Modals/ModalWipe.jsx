import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ModalWipeWallet extends React.Component {

	onClose(e) {
		e.preventDefault();
		this.props.close();
	}

	render() {
		const {
			show,
		} = this.props;

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
								<h3>Your PIN cannot be restored</h3>
							</div>
							<div className="form-info-description">You can clear your account data from Echo Desktop and set a new PIN. If you do, you wil lose access to the accounts you’ve logged into. You will need to log into them again, after you have set a ne PIN.</div>
							<div className="check-list">
								<div className="check">
									<input type="checkbox" id="wipe-agree" />
									<label className="label" htmlFor="wipe-agree">
										<span className="label-text">I understand the Echo Desktop does not store backups of my account keys, and I will lose access to them  by clearing my account data</span>
									</label>
								</div>
							</div>
							<div className="form-panel">
								<Button
									basic
									type="submit"
									className="main-btn"
									content="Clear data"
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
	close: PropTypes.func.isRequired,
};

ModalWipeWallet.defaultProps = {
	show: false,
};

export default ModalWipeWallet;
