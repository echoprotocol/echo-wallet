import React from 'react';
import { Form } from 'semantic-ui-react';

import FormComponent from './FormComponent';
import ButtonComponent from './ButtonComponent';

class CreateContract extends React.Component {

	render() {
		return (
			<Form className="main-form">
				<FormComponent />
				<ButtonComponent />
			</Form>
		);
	}

}

export default CreateContract;
