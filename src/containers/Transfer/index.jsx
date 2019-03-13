import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import { clearForm, setIn } from '../../actions/FormActions';
import { transfer, resetTransaction } from '../../actions/TransactionActions';

import TransactionScenario from '../TransactionScenario';

import ToAccountField from './ToAccountField';
import AmountField from '../../components/AmountField';
import NoteField from './NoteField';

class Transfer extends React.Component {

	componentDidMount() {
		const { accountName } = this.props;
		this.props.setIn('from', { value: accountName, checked: true });
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.accountName !== this.props.accountName;
	}

	componentWillUnmount() {
		this.props.clearForm();
		this.props.resetTransaction();
	}

	render() {
		return (
			<TransactionScenario handleTransaction={() => this.props.transfer()}>
				{
					(submit) => (
						<Form className="main-form">
							<div className="field-wrap">
								<Form.Field>
									<label htmlFor="accountFrom">From</label>
									<div className="ui">
										<input name="accountFrom" className="ui input" disabled placeholder="Account name" value={this.props.accountName} />
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
	setIn: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		accountName: state.global.getIn(['activeUser', 'name']),
	}),
	(dispatch) => ({
		clearForm: () => dispatch(clearForm(FORM_TRANSFER)),
		transfer: () => dispatch(transfer()),
		resetTransaction: () => dispatch(resetTransaction()),
		setIn: (field, param) => dispatch(setIn(FORM_TRANSFER, field, param)),
	}),
)(Transfer);
