import React from 'react';
import { Form } from 'semantic-ui-react';

import FormComponent from './FormComponent';

class Transfer extends React.Component {

	render() {

		return (
			<Form className="main-form">
				<FormComponent />
			</Form>
		);
	}

}

export default Transfer;
