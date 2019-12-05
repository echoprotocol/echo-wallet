import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/ModalActions';

import { MODAL_WHITELIST } from '../../constants/ModalConstants';
import Avatar from '../Avatar';
import ActionBtn from '../../components/ActionBtn';

class ModalWhitelist extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}


	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}


	render() {
		const {
			show,
		} = this.props;

		return (
			<Modal className="whitelist-modal" open={show} dimmer="inverted">
				<span
					className="icon-close"
					onClick={(e) => this.onClose(e)}
					onKeyDown={(e) => this.onClose(e)}
					role="button"
					tabIndex="0"
				/>
				<div className="modal-header">
					<h3 className="modal-header-title">Whitelist</h3>
				</div>
				<div className="modal-body">
					<div className="segments">
						<button className="segment">
							<Avatar accountName="pet88" />
							<div className="name">pet88</div>
							<ActionBtn
								icon="remove"
								text="Remove"
							/>
						</button>
						<button className="segment">
							<Avatar accountName="val32" />
							<div className="name">val32</div>
							<ActionBtn
								icon="remove"
								text="Remove"
							/>
						</button>
						<button className="segment">
							<Avatar accountName="rom24" />
							<div className="name">rom24</div>
							<ActionBtn
								icon="remove"
								text="Remove"
							/>
						</button>
						<button className="segment">
							<Avatar accountName="alex_92" />
							<div className="name">alex_92</div>
							<ActionBtn
								icon="remove"
								text="Remove"
							/>
						</button>
					</div>
					<div className="form-panel">
						<Button
							className="main-btn"
							content="Add account"
							onClick={(e) => this.onClose(e)}
						/>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalWhitelist.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
};

ModalWhitelist.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_WHITELIST, 'show']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_WHITELIST)),
	}),
)(ModalWhitelist);
