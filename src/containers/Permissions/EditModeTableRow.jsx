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
				<Form.Field className={classnames('error-wrap', { error: false })}>
					<label htmlFor="WIF">WIF (optional)</label>
					<div className="action-input">
						<input
							type={show ? 'text' : 'password'}
							placeholder="WIF (optional)"
							name="WIF"
							className="input"
							value={wif.value}
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

export default EditModeTableRow;
