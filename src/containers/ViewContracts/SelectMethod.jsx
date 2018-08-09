import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { FORM_CALL_CONTRACT } from '../../constants/FormConstants';
import { setFormValue } from '../../actions/FormActions';

class SelectMethod extends React.Component {

	render() {
		const methods = this.props.functions.map((f) => ({
			key: f.name, value: f.name, text: f.name,
		})).toArray();

		return (
			<Form.Field>
				<label htmlFor="Method">Select method</label>
				<Dropdown
					placeholder="Enter method or choose it from dropdown list"
					search
					fluid
					selection
					label=""
					options={methods}
				/>
			</Form.Field>

		);
	}

}

SelectMethod.propTypes = {
    location: PropTypes.object.isRequired,
    functions: PropTypes.object,
    setFormValue: PropTypes.func.isRequired,
};

SelectMethod.defaultProps = {
    functions: [],
};

export default connect(
    (state) => ({
        functions: state.contract.get('functions'),
    }),
    (dispatch) => ({
        setFormValue: (field, value) => dispatch(setFormValue(FORM_CALL_CONTRACT, field, value)),
    }),
)(SelectMethod);
