import React from 'react';
import { Form, Popup } from 'semantic-ui-react';
import classnames from 'classnames';

export default class Threshold extends React.Component {

	render() {


		return (
			<Form className="edit-threshold">
				<Form.Field className={classnames({ error: false })}>
					<Popup
						trigger={<span className="inner-tooltip-trigger icon-info" />}
						content="You can split authority to sign a transaction by setting threshold. Total weight of all the keys in the wallet must be equal or more than threshold to sign a transaction."
						className="inner-tooltip"
						position="bottom center"
						style={{ width: 420 }}
					/>
					<span className="threshold">threshold: </span>
					<input
						type="text"
						placeholder="Threshold"
						name="threshold"
						className="input"
					/>
					<span className="error-message">error</span>
				</Form.Field>
			</Form>
		);
	}

}
