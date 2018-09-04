import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { FORM_CALL_CONTRACT } from '../../../constants/FormConstants';
import { setInFormValue } from '../../../actions/FormActions';
import { setContractFees } from '../../../actions/ContractActions';
import { formatCallContractField } from '../../../helpers/FormatHelper';

class TabCallContracts extends React.Component {

	onChange(e) {
		const { field } = this.props;
		const value = e.target.value.trim();
		if (field) {
			this.props.setFormValue(field, value);
			this.props.setContractFees();
		}
	}
	render() {
		const { data, type, field } = this.props;
		const formatedField = formatCallContractField(field);

		return (

			<Form.Field className={classnames('error-wrap', { error: data.error })}>
				<label htmlFor={formatedField}>{formatedField}</label>

				<input
					placeholder={`(${type.replace(/address/g, 'id')})`}
					name={field}
					className="ui input"
					value={data.value}
					onChange={(e) => this.onChange(e)}
				/>
				<span className="error-message">{data.error}</span>
			</Form.Field>
		);
	}

}

TabCallContracts.propTypes = {
	setFormValue: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	field: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
};

export default connect(
	(state, ownProps) => {
		const { field, type } = ownProps;
		const data = state.form.getIn([FORM_CALL_CONTRACT, 'inputs', field]);
		return { field, data, type };
	},
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setInFormValue(FORM_CALL_CONTRACT, ['inputs', field], value)),
		setContractFees: () => dispatch(setContractFees(FORM_CALL_CONTRACT)),
	}),
)(TabCallContracts);
