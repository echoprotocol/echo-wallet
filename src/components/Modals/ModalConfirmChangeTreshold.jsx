import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class modalConfirmChangeTreshold extends React.Component {

	onConfirm() {
		this.props.confirm();
	}
	onClose() {
		this.props.close();
	}
	render() {
		const {
			show, warningMessage,
		} = this.props;
		return (
			<Modal className="small unclock-size" open={show} dimmer="inverted">
				<div className="modal-content add-key">
					<div className="modal-header">Confirm transaction</div>
					<div className="modal-body">
						<div className="info-text">
							{warningMessage}
						</div>
						<div className="form-panel">
							<Button
								basic
								type="button"

								className="main-btn"
								onClick={(e) => this.onClose(e)}
								content="Do it later"
							/>
							<Button
								basic
								type="button"
								className="main-btn"
								onClick={(e) => this.onConfirm(e)}
								content="Proceed"
							/>
						</div>
					</div>
				</div>
			</Modal>
		);
	}

}


modalConfirmChangeTreshold.propTypes = {
	show: PropTypes.bool,
	confirm: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	warningMessage: PropTypes.string.isRequired,
};

modalConfirmChangeTreshold.defaultProps = {
	show: false,
};

export default modalConfirmChangeTreshold;
