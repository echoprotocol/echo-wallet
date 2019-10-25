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
			show,
		} = this.props;
		return (
			<Modal className="small" open={show} dimmer="inverted">
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
						<div className="form-info">
							<h3>Confirm logout</h3>
						</div>
						If these changes are applied, you won&apos;t have
						enough keys to sign transactions. Do you want to proceed?.
						<div className="form-panel">
							<Button
								basic
								type="button"
								className="main-btn"
								onClick={() => this.onClose()}
								content="Close"
							/>
							<Button
								basic
								type="button"
								className="main-btn"
								onClick={() => this.onConfirm()}
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
};

modalConfirmChangeTreshold.defaultProps = {
	show: false,
};

export default modalConfirmChangeTreshold;
