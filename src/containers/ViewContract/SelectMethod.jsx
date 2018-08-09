import React from 'react';
import { Dropdown, Form } from 'semantic-ui-react';

class SelectMethod extends React.Component {

	render() {
		const methods = [
			{ key: 'One', value: 'One', text: 'One' },
			{ key: 'Two', value: 'Two', text: 'Two' },
		];

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

export default SelectMethod;
