import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, Dropdown, Button } from 'semantic-ui-react';
import classnames from 'classnames';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import formatAmount from '../../helpers/HistoryHelper';
import { setFormValue, clearForm } from '../../actions/FormActions';

import AmountField from './AmountField';

class FormComponent extends React.Component {

	onComment() {

	}

	render() {
		const {
			accountName, assets, to, comment, fee,
		} = this.props;

		const feeValue = fee.value ? formatAmount(fee.value, fee.currency.precision, fee.currency.symbol) : '';

		const feeOptions = assets.map(({ balance, precision, symbol }) => ({
			key: symbol,
			value: balance,
			text: formatAmount(balance, precision, symbol),
		}));

		return (
			<div className="field-wrap">
				<Form.Field>
					<label htmlFor="accountFrom">From</label>
					<div className="ui">
						<input name="accountFrom" className="ui input" disabled placeholder="Account name" value={accountName} />
						<span className="error-message" />
					</div>
				</Form.Field>
				<Form.Field>
					<label htmlFor="accountTo">To</label>
					<Input type="text" placeholder="Account name" className={classnames('action-wrap', { loading: to.loading, error: to.error })}>
						<input name="accountTo" />
						{ to.checked ? <span className="icon-checked_1 value-status" /> : null }
						{ to.error ? <span className="icon-error_input value-status" /> : null }
						<span className="error-message">{to.error}</span>
					</Input>
				</Form.Field>
				<AmountField />
				<Form.Field>
					<label htmlFor="fee"> Fee </label>
					<Dropdown selection options={feeOptions} value={feeValue} />
				</Form.Field>
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
					{/* <div className="total-sum">
                        Total Transaction Sum:
						<span>0.0009287 BTC</span>
					</div> */}
					<Button basic type="submit" color="orange">Send</Button>
				</div>
			</div>
		);
	}

}

FormComponent.propTypes = {
	accountName: PropTypes.string.isRequired,
	assets: PropTypes.any.isRequired,
	to: PropTypes.any.isRequired,
	// amount: PropTypes.any.isRequired,
	fee: PropTypes.any.isRequired,
	comment: PropTypes.any.isRequired,
	// setFormValue: PropTypes.func.isRequired,
	// clearForm: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		accountName: state.global.getIn(['activeUser', 'name']),
		assets: state.balance.get('assets').toArray(),
		to: state.form.getIn([FORM_TRANSFER, 'to']),
		amount: state.form.getIn([FORM_TRANSFER, 'amount']),
		fee: state.form.getIn([FORM_TRANSFER, 'fee']),
		comment: state.form.getIn([FORM_TRANSFER, 'comment']),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_TRANSFER, field, value)),
		clearForm: () => dispatch(clearForm(FORM_TRANSFER)),
	}),
)(FormComponent);
