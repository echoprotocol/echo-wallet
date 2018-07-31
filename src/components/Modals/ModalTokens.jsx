import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { MODAL_TOKENS } from '../../constants/ModalConstants';
import { setParamValue, closeModal } from '../../actions/ModalActions';
import { addToken } from '../../actions/BalanceActions';

class ModalTokens extends React.Component {

	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}

	onInput(e) {
		this.props.setParamValue('address', e.target.value);
	}

	onClick() {
		this.props.addToken(this.props.address.value.trim());
	}

	render() {
		const { show, address } = this.props;

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
						<Form className="user-form">
							<div className="form-info">
								<h3>Watch Token</h3>
							</div>
							<div className="field-wrap">
								<Form.Field>
									<label htmlFor="tokens">Token name</label>
									<div className={classnames({ error: address.error })}>
										<input
											type="text"
											placeholder="Contract Address"
											name="address"
											className="ui input"
											value={address.value}
											onInput={(e) => this.onInput(e)}
										/>
										<span className="error-message">{address.error}</span>
									</div>
								</Form.Field>
							</div>
							<Button basic type="button" color="orange" onClick={(e) => this.onClick(e)}>Watch Token</Button>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalTokens.propTypes = {
	show: PropTypes.bool,
	address: PropTypes.object.isRequired,
	closeModal: PropTypes.func.isRequired,
	setParamValue: PropTypes.func.isRequired,
	addToken: PropTypes.func.isRequired,
};

ModalTokens.defaultProps = {
	show: false,
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_TOKENS, 'show']),
		address: state.modal.getIn([MODAL_TOKENS, 'address']),
		error: state.modal.getIn([MODAL_TOKENS, 'error']),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_TOKENS)),
		setParamValue: (param, value) => dispatch(setParamValue(MODAL_TOKENS, param, value)),
		addToken: (value) => dispatch(addToken(value)),
	}),
)(ModalTokens);
