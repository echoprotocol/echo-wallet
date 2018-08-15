import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { FORM_CALL_CONTRACT } from '../../../constants/FormConstants';
import { setInFormValue } from '../../../actions/FormActions';
import { formatCallContractField } from '../../../helpers/FormatHelper';

class TabCallContracts extends React.Component {

	onChange(e) {
		const field = e.target.name;
		const value = e.target.value.trim();
		if (field) {
			this.props.setFormValue(field, value);
		}
	}
	render() {
		const { data } = this.props;
		const field = formatCallContractField(this.props.field);

		return (
			<div className={classnames({ error: data.error, 'action-wrap textarea-wrap': true })}>

				<Form.Field
					control="input"
					name={field}
					placeholder={field}
					value={data.value}
					label={field}
					onChange={(e) => this.onChange(e)}
				/>
				<span className="error-message">{data.error}</span>
			</div>
		);
	}

}

TabCallContracts.propTypes = {
	setFormValue: PropTypes.func.isRequired,
	field: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
};

export default connect(
	(state, ownProps) => {
		const { field } = ownProps;
		const data = state.form.getIn([FORM_CALL_CONTRACT, 'inputs', field]);
		return { field, data };
	},
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setInFormValue(FORM_CALL_CONTRACT, ['inputs', field], value)),
	}),
)(TabCallContracts);
