import React from 'react';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class EditModeTableRow extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			show: false,
		};
	}

	toggleShow(show) {
		this.setState({
			show: !show,
		});
	}

	renderType(type) {
		const { show } = this.state;
		const {
			name, keyRole, subject, wif, setPublicKey, setWif, setAccount,
		} = this.props;
		const inputType = show ? 'text' : 'password';

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
				<Form.Field className={classnames('input-eye error-wrap', { error: wif.error })}>
					<label htmlFor="WIF">WIF (optional)</label>
					<div className="action-input">
						<input
							type={inputType}
							placeholder="WIF (optional)"
							name={name}
							className="input"
							value={wif.value}
							onChange={setWif}
						/>
						{
							show ?
								<button onClick={() => this.toggleShow(show)} className="icon icon-e-show" /> :
								<button onClick={() => this.toggleShow(show)} className="icon icon-e-hide" />
						}
					</div>
					{wif.error && <span className="error-message">{wif.error}</span>}
				</Form.Field>
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
