import React from 'react';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import InputEye from '../../components/InputEye';

export default class EditModeTableRow extends React.Component {

	renderType(type) {
		const { keyRole, subject, wif } = this.props;


		return type === 'keys' ? (
			<React.Fragment>
				<Form.Field className={classnames('error-wrap', { error: true })}>
					<label htmlFor="PublicKey">{keyRole === 'active' ? 'Public key' : 'EchoRand key'}</label>
					<input
						type="text"
						placeholder={keyRole === 'active' ? 'Public key' : 'EchoRand key'}
						name="PublicKey"
						className="input"
						value={subject.value}
					/>
					{subject.error && <span className="error-message">{subject.error}</span>}
				</Form.Field>

				<InputEye
					inputLabel="WIF (optional)"
					inputPlaceholder="WIF"
					inputName="WIF"
					value={wif.value}
				/>
			</React.Fragment>
		) : (
			<Form.Field className={classnames('error-wrap', { error: false })}>
				<label htmlFor="AccountName">Account name</label>
				<input
					type="text"
					placeholder="Account name"
					name="AccountName"
					value={subject.value}
				/>
				{subject.error && <span className="error-message">{subject.error}</span>}
			</Form.Field>
		);
	}

	render() {
		const {
			type, keyRole, removeKey, subject, weight,
		} = this.props;

		return (
			<div className="list-item">
				<div className="list-item-content">
					<div className={classnames('edit-permissions-wrap', { 'echo-rand': keyRole === 'echoRand' })}>
						{this.renderType(type)}
						{
							keyRole === 'active' && (
								<Form.Field className="weight-field">
									<label htmlFor="weight">Weight</label>
									<input
										type="text"
										placeholder="Weight"
										name="weight"
										className="input"
										value={weight.value}
									/>
									{weight.error && <span className="error-message">{weight.error}</span>}
								</Form.Field>
							)
						}
					</div>
				</div>
				{
					keyRole === 'active' &&
					<div className="list-item-panel">
						<button
							className="remove-btn icon-remove"
							onClick={() => removeKey(subject.key)}
						/>
					</div>
				}

			</div>
		);
	}

}

EditModeTableRow.propTypes = {
	subject: PropTypes.object,
	wif: PropTypes.object,
	weight: PropTypes.object,
	type: PropTypes.string,
	keyRole: PropTypes.string.isRequired,
	removeKey: PropTypes.func.isRequired,
	setWif: PropTypes.func.isRequired,
	setPublicKey: PropTypes.func.isRequired,
	setWeight: PropTypes.func.isRequired,
	// isChanged: PropTypes.func.isRequired,
	// validateField: PropTypes.func.isRequired,
};

EditModeTableRow.defaultProps = {
	subject: {},
	weight: {},
	type: '',
	wif: {},
};
