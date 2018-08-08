import React from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import AmountField from './AmountField';
import SelectMethod from './SelectMethod';

import { FORM_CALL_CONTRACT } from '../../constants/FormConstants';
import { setFormValue } from '../../actions/FormActions';

class TabCallContracts extends React.Component {

	render() {
		return (
			<div className="tab-content">

				<Form className="main-form">

					<div className="field-wrap">
						<SelectMethod />
						<Form.Field>
							<label htmlFor="Owner">Owner</label>
							<div className="ui">
								<input name="Owner" className="ui input" placeholder="Owner" />
								<span className="error-message" />
							</div>
						</Form.Field>
						{/* ВЗЯЛ И TRANSFER */}
						<AmountField />
						<div className="form-panel">
							<Button basic type="submit" color="orange">Send</Button>
						</div>
					</div>
				</Form>
			</div>
		);
	}

}

TabCallContracts.propTypes = {
	location: PropTypes.object.isRequired,
	functions: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		functions: state.contract.get('functions'),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_CALL_CONTRACT, field, value)),
	}),
)(TabCallContracts);
