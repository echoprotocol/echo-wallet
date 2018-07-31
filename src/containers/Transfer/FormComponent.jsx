import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import { setFormValue, clearForm } from '../../actions/FormActions';
import { transfer } from '../../actions/TransactionActions';

import ToAccountField from './ToAccountField';
import AmountField from './AmountField';
import FeeField from './FeeField';

class FormComponent extends React.Component {

	componentWillUnmount() {
		this.props.clearForm();
	}

	onComment(e) {
		this.props.setFormValue('comment', e.target.value);
	}

	onSend() {
		this.props.transfer();
	}

	render() {
		const { account, comment } = this.props;

		return (
			<div className="field-wrap">
				<Form.Field>
					<label htmlFor="accountFrom">From</label>
					<div className="ui">
						<input name="accountFrom" className="ui input" disabled placeholder="Account name" value={account.name} />
						<span className="error-message" />
					</div>
				</Form.Field>
				<ToAccountField />
				<AmountField />
				<FeeField />
				<Form.Field>
					<Form.Field
						label="Comment"
						className="comment"
						placeholder="Comment"
						control="textarea"
						value={comment.value}
						onChange={(e) => this.onComment(e)}
					/>
				</Form.Field>
				<div className="form-panel">
					{/*
						<div className="total-sum">
	                        Total Transaction Sum:
							<span>0.0009287 BTC</span>
						</div>
					*/}
					<Button basic type="submit" color="orange" onClick={(e) => this.onSend(e)}>Send</Button>
				</div>
			</div>
		);
	}

}

FormComponent.propTypes = {
	account: PropTypes.object.isRequired,
	comment: PropTypes.any.isRequired,
	setFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	transfer: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		account: state.global.getIn(['activeUser']).toJS(),
		comment: state.form.getIn([FORM_TRANSFER, 'comment']),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_TRANSFER, field, value)),
		clearForm: () => dispatch(clearForm(FORM_TRANSFER)),
		transfer: (params) => dispatch(transfer(params)),
	}),
)(FormComponent);
