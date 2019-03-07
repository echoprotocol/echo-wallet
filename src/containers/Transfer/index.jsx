import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import { clearForm } from '../../actions/FormActions';
import { transfer, resetTransaction } from '../../actions/TransactionActions';

import TransactionScenario from '../TransactionScenario';

import ToAccountField from './ToAccountField';
import AmountField from '../../components/AmountField';
import NoteField from './NoteField';

class Transfer extends React.Component {

	shouldComponentUpdate(nextProps) {
		return nextProps.accountName !== this.props.accountName;
	}

	componentWillUnmount() {
		this.props.clearForm();
		this.props.resetTransaction();
	}

	render() {
		const { accountName } = this.props;

		return (
			<TransactionScenario handleTransaction={() => this.props.transfer()}>
				{
					(submit) => (
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
								<AmountField form={FORM_TRANSFER} />
								<NoteField />
								<div className="form-panel">
									{/*
										<div className="total-sum">
										Total Transaction Sum:
										<span>0.0009287 BTC</span>
										</div>
										*/}
									<Button
										basic
										type="submit"
										className="main-btn"
										content="Send"
										onClick={submit}
									/>
								</div>
							</div>
						</Form>
					)
				}
			</TransactionScenario>
		);
	}

}

Transfer.propTypes = {
	accountName: PropTypes.string.isRequired,
	clearForm: PropTypes.func.isRequired,
	transfer: PropTypes.func.isRequired,
	resetTransaction: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		accountName: state.global.getIn(['activeUser', 'name']),
	}),
	(dispatch) => ({
		clearForm: () => dispatch(clearForm(FORM_TRANSFER)),
		transfer: () => dispatch(transfer()),
		resetTransaction: () => dispatch(resetTransaction()),
	}),
)(Transfer);
