import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import { clearForm } from '../../actions/FormActions';
import { transfer } from '../../actions/TransactionActions';

import ToAccountField from './ToAccountField';
import AmountField from './AmountField';

import ToastActions from '../../actions/ToastActions';
import ToastSuccess from '../../components/Toast/ToastSuccess';
import ToastError from '../../components/Toast/ToastError';
import ToastInfo from '../../components/Toast/ToastInfo';

import CommentField from './CommentField';

class Transfer extends React.Component {

	shouldComponentUpdate(nextProps) {
		return nextProps.accountName !== this.props.accountName;
	}

	componentWillUnmount() {
		this.props.clearForm();
	}

	onSend() {
		ToastActions.toastInfo(ToastInfo);
		ToastActions.toastSuccess(ToastSuccess);
		ToastActions.toastError(ToastError);
		this.props.transfer();
	}

	render() {
		const { accountName } = this.props;

		return (
			<Form className="main-form">
				<div className="field-wrap">
					<Form.Field>
						<label htmlFor="accountFrom">From</label>
						<div className="ui">
							<input name="accountFrom" className="ui input" disabled placeholder="Account name" value={accountName} />
							<span className="error-message" />
						</div>
					</Form.Field>
					<ToAccountField />
					<AmountField />
					<CommentField />
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
			</Form>
		);
	}

}

Transfer.propTypes = {
	accountName: PropTypes.string.isRequired,
	clearForm: PropTypes.func.isRequired,
	transfer: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		accountName: state.global.getIn(['activeUser', 'name']),
	}),
	(dispatch) => ({
		clearForm: () => dispatch(clearForm(FORM_TRANSFER)),
		transfer: (params) => dispatch(transfer(params)),
	}),
)(Transfer);
