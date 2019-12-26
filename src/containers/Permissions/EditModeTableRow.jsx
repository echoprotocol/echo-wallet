import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import PasswordInput from './../../components/PasswordInput';
import ErrorMessage from '../../components/ErrorMessage';

class EditModeTableRow extends React.Component {

	renderType(type) {
		const {
			name, keyRole, subject, wif, setPublicKey, setWif, setAccount, intl,
		} = this.props;

		const accountPlaceholder = intl.formatMessage({ id: 'backup_and_permissions_page.edit_mode.account_input.placeholder' });
		const label = keyRole === 'active' ?
			intl.formatMessage({ id: 'backup_and_permissions_page.edit_mode.public_key_field.title' }) :
			intl.formatMessage({ id: 'backup_and_permissions_page.edit_mode.echorand_field.title' });
		const placeholder = keyRole === 'active' ?
			intl.formatMessage({ id: 'backup_and_permissions_page.edit_mode.public_key_field.placeholder' }) :
			intl.formatMessage({ id: 'backup_and_permissions_page.edit_mode.echorand_field.placeholder' });
		const WIFlabel = intl.formatMessage({ id: 'backup_and_permissions_page.edit_mode.wif_input.title' });
		const WIFplaceholder = intl.formatMessage({ id: 'backup_and_permissions_page.edit_mode.wif_input.placeholder' });
		return type === 'keys' ? (
			<React.Fragment>
				<div className={classnames('field', { error: subject.error })}>
					<label htmlFor="PublicKey">{label}</label>
					<input
						type="text"
						placeholder={placeholder}
						name={name}
						className="input"
						value={subject.value}
						onChange={setPublicKey}
					/>
					<ErrorMessage
						value={subject.error}
						intl={intl}
					/>
				</div>
				<PasswordInput
					key="edit-wif"
					unique="unique-edit-wif"
					errorMessage={wif.error}
					inputLabel={WIFlabel}
					inputPlaceholder={WIFplaceholder}
					inputName={name}
					value={wif.value}
					onChange={setWif}
					intl={intl}
				/>

			</React.Fragment>
		) : (
			<div className={classnames('field', { error: subject.error })}>
				<label htmlFor="AccountName">
					<FormattedMessage id="backup_and_permissions_page.edit_mode.account_input.title" />
				</label>
				<input
					type="text"
					placeholder={accountPlaceholder}
					name={name}
					value={subject.value}
					onChange={setAccount}
				/>
				<ErrorMessage
					value={subject.error}
					intl={intl}
				/>
			</div>
		);
	}

	render() {
		const {
			type, keyRole, removeKey, subject, weight, setWeight, name, showRemove, intl,
		} = this.props;
		const weightPlaceholder = intl.formatMessage({ id: 'backup_and_permissions_page.edit_mode.weight_input.placeholder' });

		return (
			<div className="list-item">
				<div className="list-item-content">
					<div className={classnames('edit-permissions-wrap', { 'echo-rand': keyRole === 'echoRand' })}>
						{this.renderType(type)}
						{
							keyRole === 'active' && (
								<div className={classnames('field weight-field', { error: weight.error })}>
									<label htmlFor="weight">
										<FormattedMessage id="backup_and_permissions_page.edit_mode.weight_input.title" />
									</label>
									<input
										type="text"
										placeholder={weightPlaceholder}
										name={name}
										className="input"
										value={weight.value}
										onChange={setWeight}
									/>
									<ErrorMessage
										value={weight.error}
										intl={intl}
									/>
								</div>
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
	intl: PropTypes.any.isRequired,
};

EditModeTableRow.defaultProps = {
	subject: {},
	weight: {},
	type: '',
	wif: {},
};

export default injectIntl(EditModeTableRow);
