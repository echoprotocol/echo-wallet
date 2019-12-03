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
import ActionBtn from '../../components/ActionBtn';

class ContractSettings extends React.Component {


	constructor() {
		super();
		this.state = {
			isEditName: false,
			timeout: null,
		};
		this.onFocusInput = this.onFocusInput.bind(this);
	}

	onBlurBlock(contractId) {
		this.setState({
			timeout: setTimeout(() => this.changeName(contractId), 100),
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

	onPushEnter(e, contractId) {
		if (e.which === 13 || e.keyCode === 13) {
			this.changeName(contractId);
		}
	}

	changeName(id) {
		const newName = this.props.newName.value;

		if (newName) {
			const newNameError = validateContractName(newName.trim());

			if (newNameError) {
				this.props.setFormError('newName', newNameError);
				return;
			}

			this.props.updateContractName(id, newName.trim());
		}

		this.setState({ isEditName: false });

		this.props.setValue('newName', { error: null, value: '' });
	}

	removeContract(id) {
		this.props.disableContract(id);
	}

	renderName() {
		const { contractName } = this.props;

		return (

			<Button
				className="value"
				onFocus={() => this.onOpen()}
			>
				<React.Fragment>
					{contractName}
					<span className="icon-edit" />
				</React.Fragment>
			</Button >

		);
	}

	renderChangeName() {
		const { newName, contractId, contractName } = this.props;

		return (

			<div
				className={classnames('error-wrap', { error: newName.error })}
				onBlur={() => this.onBlurBlock(contractId)}
				onFocus={() => this.onFocusBlock()}
			>
				<Input
					type="text"
					name="newName"
					defaultValue={contractName}
					ref={this.onFocusInput}
					className="label-in-left"
					onChange={(e) => this.onChange(e)}
					onKeyPress={(e) => this.onPushEnter(e, contractId)}
				>

					<input />
					<button
						className="edit-option icon-edit-checked"
						onClick={() => this.changeName(contractId)}
					/>
					<button
						className="edit-option icon-edit-close"
						onClick={(e) => this.onClose(e)}
					/>
				</Input>

				<span className="error-message">{newName.error}</span>
			</div>
		);
	}

	render() {
		const { contractId } = this.props;

		return (
			<div className="tab-full">
				<div className="control-wrap">
					<ul className="control-panel">
						<li className="id-panel">
							<span className="label">Contract ID:</span>
							<span className="value">
								{contractId}
							</span>
						</li>
						<li className="balance-panel">
							<span className="label">Balance:</span>
							<span className="value">
								<div className="balance-wrap">
									<div className="balance">0.0038</div>
									<div className="coin">ECHO</div>
								</div>
							</span>
						</li>
						<li className="name-panel">
							<span className="label">Name:</span>
							{!this.state.isEditName ? this.renderName() : this.renderChangeName()}
						</li>
						<li className="action-panel">
							<ActionBtn
								action={() => this.removeContract(contractId)}
								icon="remove"
								text="Remove"
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
	contractId: PropTypes.string.isRequired,
	contractName: PropTypes.string.isRequired,
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
		contractName: state.contract.get('name'),
	}),
	(dispatch) => ({
		updateContractName: (id, newName) => dispatch(updateContractName(id, newName)),
		disableContract: (name) => dispatch(disableContract(name)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_VIEW_CONTRACT, field, value)),
		setValue: (field, value) => dispatch(setValue(FORM_VIEW_CONTRACT, field, value)),
		setFormError: (field, value) => dispatch(setFormError(FORM_VIEW_CONTRACT, field, value)),
	}),
)(ContractSettings));
