import React from 'react';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import InputEye from '../../components/InputEye';

export default class ThresholdRow extends React.Component {

	renderType(type) {
		const { keyRole } = this.props;

		if (type === 'keys') {
			return (
				<React.Fragment>
					<Form.Field className={classnames('error-wrap', { error: true })}>
						<label htmlFor="PublicKey">{keyRole === 'active' ? 'Public key' : 'EchoRand key'}</label>
						<input
							type="text"
							placeholder={keyRole === 'active' ? 'Public key' : 'EchoRand key'}
							name="PublicKey"
							className="input"
						/>
						{true && <span className="error-message">Some error</span>}
					</Form.Field>

					<InputEye
						inputLabel="WIF (optional)"
						inputPlaceholder="WIF"
						inputName="WIF"
					/>
				</React.Fragment>
			);
		}


		return (
			<Form.Field className={classnames('error-wrap', { error: false })}>
				<label htmlFor="AccountName">Account name</label>
				<input
					type="text"
					placeholder="Account name"
					name="AccountName"
					className="input"
				/>
				{false && <span className="error-message">Some error</span>}
			</Form.Field>
		);
	}

	render() {
		const { type, keyRole } = this.props;

		return (
			<div className="list-item">
				<div className="list-item-content">
					<div className={classnames('edit-permissions-wrap', { 'echo-rand': keyRole === 'echoRand' })}>
						{ this.renderType(type) }
						{
							keyRole === 'active' &&
							<Form.Field className="weight-field">
								<label htmlFor="weight">Weight</label>
								<input
									type="text"
									placeholder="Weight"
									name="weight"
									className="input"
								/>
							</Form.Field>
						}
					</div>
				</div>
				{
					keyRole === 'active' &&
					<div className="list-item-panel">
						<button className="remove-btn icon-remove" />
					</div>
				}

			</div>
		);
	}

}

ThresholdRow.propTypes = {
	type: PropTypes.string.isRequired,
	keyRole: PropTypes.string.isRequired,
};
