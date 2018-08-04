import React from 'react';
import { Form, Button } from 'semantic-ui-react';

class AddToWatchList extends React.Component {

	render() {
		return (
			<Form className="main-form">
				<div className="form-info">
					<h3>Add contract to watch list</h3>
				</div>
				<div className="field-wrap">
					<Form.Field>
						<label htmlFor="Name">Name</label>
						<div>
							<input
								type="text"
								placeholder="Name"
								name="Name"
								className="ui input"
								value="Name.value"
							/>
							<span className="error-message">Name.error</span>
						</div>
					</Form.Field>
					<Form.Field>
						<label htmlFor="ID">ID</label>
						<div>
							<input
								type="text"
								placeholder="Contract ID"
								name="ID"
								className="ui input"
								value="ID.value"
							/>
							<span className="error-message">ID.error</span>
						</div>
					</Form.Field>
					<Form.Field>
						<label htmlFor="Abi">ABI</label>
						<div className="error">
							<textarea
								type="text"
								placeholder="Contract ABI"
								name="abi"
								className="ui input"
								value="abi.value"
							/>
							<span className="error-message">abi.error</span>
						</div>
					</Form.Field>
				</div>
				<Button basic type="button" color="orange">Watch Contract</Button>
			</Form>
		);
	}

}

export default AddToWatchList;
