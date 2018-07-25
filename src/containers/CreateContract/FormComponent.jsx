import React from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';

class FormComponent extends React.Component {

	render() {

		return (
			<div className="field-wrap">
				<div className="form-info">
					<h3>Create Smart Contract</h3>
				</div>
				<Form.Field>
					<Form.Field label="ByteCode" placeholder="Byte Code" control="textarea" />
				</Form.Field>
				<div className="form-panel">
					<Button basic type="submit" color="orange">Create</Button>
				</div>
			</div>
		);
	}

}

export default connect()(FormComponent);
