import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import AmountField from '../../../components/AmountField';
import FeeField from '../../../components/AmountField/FeeField';
import SelectMethod from './SelectMethod';
import ButtonComponent from './ButtonComponent';

import { FORM_CALL_CONTRACT } from '../../../constants/FormConstants';

import { setFormValue } from '../../../actions/FormActions';

import Field from './FieldComponent';

class TabCallContracts extends React.Component {

	renderFields(functionForm) {
		return Object.keys(functionForm.get('inputs').toJS()).map((key) => (
			<Field key={key} field={key} />
		));
	}

	renderAmount(functionForm) {
		const payable = functionForm.get('payable');
		const functionName = functionForm.get('functionName');

		if (functionName) {
			return payable ?
				<AmountField form={FORM_CALL_CONTRACT} /> : <FeeField form={FORM_CALL_CONTRACT} />;
		}
		return null;
	}

	render() {
		const { functionForm } = this.props;

		return (
			<div className="tab-content">

				<Form className="main-form">

					<div className="field-wrap">
						<SelectMethod />
						{
							this.renderFields(functionForm)
						}
						{
							this.renderAmount(functionForm)
						}
						<ButtonComponent />
					</div>
				</Form>
			</div>
		);
	}

}

TabCallContracts.propTypes = {
	functionForm: PropTypes.object.isRequired,
};

export default connect(
	(state) => ({
		functionForm: state.form.get(FORM_CALL_CONTRACT),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_CALL_CONTRACT, field, value)),
	}),
)(TabCallContracts);
