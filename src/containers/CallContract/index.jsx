import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import TransactionScenario from '../TransactionScenario';

import { FORM_CALL_CONTRACT_VIA_ID } from '../../constants/FormConstants';

import AmountField from '../../components/AmountField';

import { setFormValue, clearForm } from '../../actions/FormActions';
import { callContractViaId } from '../../actions/TransactionActions';
import { setContractFees } from '../../actions/ContractActions';

class AddContractComponent extends React.Component {

	componentWillUnmount() {
		this.props.clearForm();
	}

	onInput(e) {
		this.props.setFormValue(e.target.name, e.target.value.trim());
		if (e.target.name === 'bytecode') this.props.setContractFees();
	}

	render() {
		const { bytecode, id } = this.props;

		return (
			<TransactionScenario handleTransaction={() => this.props.callContract()}>
				{
					(submit) => (
						<Form className="main-form">
							<div className="form-info">
								<h3>Call contract via ID</h3>
							</div>
							<div className="field-wrap">
								<Form.Field className={classnames('error-wrap', { error: id.error })}>
									<label htmlFor="id">ID</label>
									<input
										type="text"
										placeholder="Contract ID"
										name="id"
										className="ui input"
										value={id.value}
										onChange={(e) => this.onInput(e)}
										autoFocus
									/>
									<span className="error-message">{id.error}</span>
								</Form.Field>
								<Form.Field className={classnames('error-wrap', { error: bytecode.error })}>
									<label htmlFor="bytecode">Bytecode</label>
									<textarea
										type="text"
										placeholder="Bytecode"
										name="bytecode"
										className="ui input"
										value={bytecode.value}
										onChange={(e) => this.onInput(e)}
									/>
									<span className="error-message">{bytecode.error}</span>
								</Form.Field>
								<AmountField form={FORM_CALL_CONTRACT_VIA_ID} />
							</div>

							<Button
								basic
								type="button"
								className="main-btn"
								onClick={submit}
								content="Call Contract"
							/>
						</Form>
					)
				}
			</TransactionScenario>
		);
	}

}

AddContractComponent.propTypes = {
	id: PropTypes.object.isRequired,
	bytecode: PropTypes.object.isRequired,
	clearForm: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	callContract: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
};


export default connect(
	(state) => ({
		id: state.form.getIn([FORM_CALL_CONTRACT_VIA_ID, 'id']),
		bytecode: state.form.getIn([FORM_CALL_CONTRACT_VIA_ID, 'bytecode']),
	}),
	(dispatch) => ({
		clearForm: () => dispatch(clearForm(FORM_CALL_CONTRACT_VIA_ID)),
		setFormValue: (param, value) => dispatch(setFormValue(FORM_CALL_CONTRACT_VIA_ID, param, value)),
		callContract: () => dispatch(callContractViaId()),
		setContractFees: () => dispatch(setContractFees(FORM_CALL_CONTRACT_VIA_ID)),
	}),
)(AddContractComponent);
