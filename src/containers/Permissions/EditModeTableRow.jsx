import React from 'react';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import PasswordInput from './../../components/PasswordInput';

class EditModeTableRow extends React.Component {

	renderType(type) {
		const {
			name, keyRole, subject, wif, setPublicKey, setWif, setAccount,
		} = this.props;

		return type === 'keys' ? (
			<React.Fragment>
				<Form.Field className={classnames('error-wrap', { error: subject.error })}>
					<label htmlFor="PublicKey">{keyRole === 'active' ? 'Public key' : 'EchoRand key'}</label>
					<input
						type="text"
						placeholder={keyRole === 'active' ? 'Public key' : 'EchoRand key'}
						name={name}
						className="input"
						value={subject.value}
						onChange={setPublicKey}
					/>
					{subject.error && <span className="error-message">{subject.error}</span>}
				</Form.Field>
				<PasswordInput
					errorMessage={wif.error}
					inputLabel="WIF (optional)"
					inputPlaceholder="WIF (optional)"
					inputName={name}
					value={wif.value}
					onChange={setWif}
				/>

			</React.Fragment>
		) : (
			<Form.Field className={classnames('error-wrap', { error: subject.error })}>
				<label htmlFor="AccountName">Account name</label>
				<input
					type="text"
					placeholder="Account name"
					name={name}
					value={subject.value}
					onChange={setAccount}
				/>
				{subject.error && <span className="error-message">{subject.error}</span>}
			</Form.Field>
		);
	}

	render() {
		const {
			type, keyRole, removeKey, subject, weight, setWeight, name, showRemove,
		} = this.props;

		return (
			<div className="list-item">
				<div className="list-item-content">
					<div className={classnames('edit-permissions-wrap', { 'echo-rand': keyRole === 'echoRand' })}>
						{this.renderType(type)}
						{
							keyRole === 'active' && (
								<Form.Field className={classnames('error-wrap weight-field', { error: weight.error })}>
									<label htmlFor="weight">Weight</label>
									<input
										type="text"
										placeholder="Weight"
										name={name}
										className="input"
										value={weight.value}
										onChange={setWeight}
									/>
									{weight.error && <span className="error-message">{weight.error}</span>}
								</Form.Field>
							)
						}
					</div>
				</div>
				{
					(keyRole === 'active' && showRemove) &&
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
	name: PropTypes.string.isRequired,
	showRemove: PropTypes.bool.isRequired,
	keyRole: PropTypes.string.isRequired,
	removeKey: PropTypes.func.isRequired,
	setWif: PropTypes.func.isRequired,
	setPublicKey: PropTypes.func.isRequired,
	setAccount: PropTypes.func.isRequired,
	setWeight: PropTypes.func.isRequired,
};

EditModeTableRow.defaultProps = {
	subject: {},
	weight: {},
	type: '',
	wif: {},
};

export default EditModeTableRow;
