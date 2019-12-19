import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import { FORM_CALL_CONTRACT } from '../../../constants/FormConstants';
import { setInFormValue, setValue } from '../../../actions/FormActions';
import { formatCallContractField } from '../../../helpers/FormatHelper';
import { setContractFees } from '../../../actions/ContractActions';

class TabCallContracts extends React.Component {

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
		const tag = formatedField.trim().toLowerCase().replace(' ', '_').concat('_field');
		return (

			<Form.Field className={classnames('error-wrap', { error: data.error })}>
				<label htmlFor={formatedField}>
					<FormattedMessage id={`smart_contract_page.contract_info.call_contract_tab.form.${tag}`} />
				</label>

				<input
					placeholder={`${type.replace(/address/g, 'id')}`}
					name={field}
					className="ui input"
					value={data.value}
					onChange={(e) => this.onChange(e)}
				/>
				{data.error && <span className="error-message">{intl.formatMessage({ id: data.error })}</span>}
			</Form.Field>
		);
	}

}

TabCallContracts.propTypes = {
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
)(TabCallContracts));
