import React from 'react';
import { Button, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import classnames from 'classnames';

import { updateContractName, disableContract } from '../../actions/ContractActions';
import { setFormValue, setValue, setFormError } from '../../actions/FormActions';

import { FORM_VIEW_CONTRACT } from '../../constants/FormConstants';
import { validateContractName } from '../../helpers/ValidateHelper';

class ContractSettings extends React.Component {


	constructor() {
		super();
		this.state = {
			isEditName: false,
			timeout: null,
		};
		this.onFocusInput = this.onFocusInput.bind(this);
	}

	onBlurBlock(contractName) {
		this.setState({
			timeout: setTimeout(() => this.changeName(contractName), 100),
		});
	}

	onFocusBlock() {
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}
	}

	onFocusInput(component) {
		if (component) {
			component.focus();
		}
	}

	onChange(e) {
		const field = e.target.name;
		const { value } = e.target;
		if (field) {
			this.props.setFormValue(field, value);
		}
	}


	onOpen() {
		this.setState({ isEditName: true });
	}

	onClose(e) {
		e.preventDefault();
		this.setState({ isEditName: false });
		this.props.setValue('newName', { error: null, value: '' });
	}

	onPushEnter(e, contractName) {
		if (e.which === 13 || e.keyCode === 13) {
			this.changeName(contractName);
		}
	}

	changeName(oldName) {
		const newName = this.props.newName.value;

		if (newName) {
			const newNameError = validateContractName(newName.trim());

			if (newNameError) {
				this.props.setFormError('newName', newNameError);
				return;
			}

			this.props.updateContractName(oldName, newName.trim());
		}

		this.setState({ isEditName: false });

		this.props.setValue('newName', { error: null, value: '' });
	}

	removeContract(name) {
		this.props.disableContract(name);
	}

	renderName() {
		const { location } = this.props;
		const contractName = location.pathname.split('/')[2];
		return (

			<Button
				className="value"
				onFocus={() => this.onOpen()}
				content={contractName}
				icon="edit"
			/>

		);
	}

	renderChangeName() {
		const { location, newName } = this.props;

		const contractName = location.pathname.split('/')[2];

		return (

			<div
				className={classnames('error-wrap', { error: newName.error })}
				onBlur={() => this.onBlurBlock(contractName)}
				onFocus={() => this.onFocusBlock()}
			>
				<Input
					type="text"
					name="newName"
					defaultValue={contractName}
					ref={this.onFocusInput}
					className="label-in-left"
					onChange={(e) => this.onChange(e)}
					onKeyPress={(e) => this.onPushEnter(e, contractName)}
				>

					<input />
					<button
						className="edit-option icon-edit-checked"
						onClick={() => this.changeName(contractName)}
					/>
					<button
						className="edit-option icon-edit-close"
						onClick={(e) => this.onClose(e)}
					/>
				</Input>

				<div className="error-message error-animation">
					<span>{newName.error}</span>
				</div>
			</div>
		);
	}

	render() {
		const { location, contractId } = this.props;

		const contractName = location.pathname.split('/')[2];

		return (
			<div className="tab-full">
				<div className="control-wrap">
					<ul className="control-panel">
						<li className="id">
							<span className="label">Contract ID:</span>
							<span className="value">
								{contractId}
							</span>
						</li>
						<li className="name">
							<span className="label">Name:</span>
							{!this.state.isEditName ? this.renderName() : this.renderChangeName()}
							{/* {this.renderChangeName()} */}
						</li>
						<li className="act">
							<Button
								icon="trash"
								className="transparent"
								content="remove"
								onClick={() => this.removeContract(contractName)}
							/>
						</li>
					</ul>

				</div>
			</div>
		);
	}

}

ContractSettings.propTypes = {
	newName: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	contractId: PropTypes.string.isRequired,
	updateContractName: PropTypes.func.isRequired,
	disableContract: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		newName: state.form.getIn([FORM_VIEW_CONTRACT, 'newName']),
		contractId: state.contract.get('id'),
	}),
	(dispatch) => ({
		updateContractName: (oldName, newName) => dispatch(updateContractName(oldName, newName)),
		disableContract: (name) => dispatch(disableContract(name)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_VIEW_CONTRACT, field, value)),
		setValue: (field, value) => dispatch(setValue(FORM_VIEW_CONTRACT, field, value)),
		setFormError: (field, value) => dispatch(setFormError(FORM_VIEW_CONTRACT, field, value)),
	}),
)(ContractSettings));
