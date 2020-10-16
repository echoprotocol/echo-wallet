import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { injectIntl } from 'react-intl';

import { FORM_CALL_CONTRACT } from '../../../constants/FormConstants';
import { setInFormValue, setValue } from '../../../actions/FormActions';
import { formatCallContractField } from '../../../helpers/FormatHelper';
import { setContractFees } from '../../../actions/ContractActions';
import ErrorMessage from '../../../components/ErrorMessage';

class FieldComponent extends React.Component {

	onChange(e) {
		const { field } = this.props;
		const value = e.target.value.trim();
		if (field) {
			this.props.setFormValue(field, value);
			this.props.setContractFees();
		}
	}

	onFee(fee) {
		if (!fee) {
			this.props.setFormValue('fee', fee);
		} else {
			this.props.setValue('fee', fee);
		}
	}

	render() {
		const {
			data, type, field, intl,
		} = this.props;
		const formatedField = formatCallContractField(field);
		return (

			<div className={classnames('field', { error: data.error })}>
				<label htmlFor={formatedField}>
					{formatedField}
				</label>

				<input
					placeholder={`${type.replace(/address/g, 'id')}`}
					name={field}
					className="input"
					value={data.value}
					onChange={(e) => this.onChange(e)}
				/>
				<ErrorMessage
					value={data.error}
					intl={intl}
				/>
			</div>
		);
	}

}

FieldComponent.propTypes = {
	field: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

export default injectIntl(connect(
	(state, ownProps) => {
		const { field, type } = ownProps;
		const data = state.form.getIn([FORM_CALL_CONTRACT, 'inputs', field]);
		return { field, data, type };
	},
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setInFormValue(FORM_CALL_CONTRACT, ['inputs', field], value)),
		setValue: (field, value) => dispatch(setValue(FORM_CALL_CONTRACT, field, value)),
		setContractFees: () => dispatch(setContractFees(FORM_CALL_CONTRACT)),
	}),
)(FieldComponent));
