import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
		const {
			show,
		} = this.props;

		// const { checked } = this.state;

		return (
			<Modal className="small wipe-data" open={show} dimmer="inverted">
				<div className="modal-content">
					<div className="modal-header">
						<h3> Do you want to add WIF keys right now?</h3>
					</div>
					<div className="modal-body">
						<p>Private key desription</p>
						<div className="form-panel">
							<Button
								basic
								type="submit"
								className="main-btn"
								role="button"
								onClick={(e) => this.onAgree(e)}
								content="YES"
							/>
							<Button
								basic
								type="submit"
								className="main-btn"
								onClick={(e) => this.onClose(e)}
								content="DO IT LATER"
							/>
						</div>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalWIF.propTypes = {
	show: PropTypes.bool,
	hide: PropTypes.func.isRequired,
	history: PropTypes.any.isRequired,
};

ModalWIF.defaultProps = {
	show: false,
};

export default withRouter(connect(
	(state) => ({
		show: state.modal.getIn([PROPOSAL_ADD_WIF, 'show']),
	}),
	(dispatch) => ({
		hide: () => dispatch(closeModal(PROPOSAL_ADD_WIF)),
	}),
)(ModalWIF));
