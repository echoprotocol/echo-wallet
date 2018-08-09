import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { FORM_CALL_CONTRACT } from '../../../constants/FormConstants';
import { setInFormValue } from '../../../actions/FormActions';

class TabCallContracts extends React.Component {

	onChange(e) {
		const field = e.target.name;
		const value = e.target.value.trim();
		if (field) {
			this.props.setFormValue(field, value);
		}
	}

	render() {
		const { field, data } = this.props;
		return (
			<Form.Field>
				<label htmlFor={field}>{field}</label>
				<div className="ui">
					<input
						name={field}
						className="ui input"
						placeholder={field}
						value={data.value}
						onChange={(e) => this.onChange(e)}
					/>
					{data.error && <span className="error-message">{data.error}</span>}
				</div>
			</Form.Field>
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
