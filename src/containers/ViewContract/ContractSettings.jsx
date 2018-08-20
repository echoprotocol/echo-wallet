import React from 'react';
import { Button, Input, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import classnames from 'classnames';

import { updateContractName, disableContract } from '../../actions/ContractActions';
import { setFormValue, setValue } from '../../actions/FormActions';

import { FORM_VIEW_CONTRACT } from '../../constants/FormConstants';

class ContractSettings extends React.Component {


	constructor() {
		super();
		this.state = {
			isEditName: false,
			inputFocus: false,
		};
		this.onFocusInput = this.onFocusInput.bind(this);
	}

	onFocusInput(component) {
		if (component) {
			component.focus();
			this.setState(...this.state, { inputFocus: true });
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
		this.setState(...this.state, { isEditName: !this.state.isEditName });
	}

	onClose(contractName) {
		if (this.state.inputFocus) {
			return;
		}
		this.changeName(contractName);
	}
	onPushEnter(e, contractName) {
		if (e.which === 13 || e.keyCode === 13) {
			this.changeName(contractName);
		}
	}

	changeName(oldName) {
		this.props.updateContractName(oldName);

		this.setState({ isEditName: false });

		this.props.setValue(
			FORM_VIEW_CONTRACT, 'newName',
			{
				error: null,
				value: '',
			},
		);
	}

	removeContract(name) {
		this.props.disableContract(name);
	}

	renderName() {
		const { location } = this.props;
		const contractName = location.pathname.split('/')[2];
		return (

			<span
				className="value pointer"
				role="button"
				onClick={() => this.onOpen()}
				onKeyPress={() => this.onOpen()}
				tabIndex="0"
			>
				{contractName}
				<Icon name="edit" />
			</span>

		);
	}

	renderChangeName() {
		const { location } = this.props;

		const contractName = location.pathname.split('/')[2];

		return (
			<React.Fragment>
				<div
					className={classnames('error-wrap', { error: false })}
				>
					<Input
						type="text"
						name="newName"
						defaultValue={contractName}
						ref={this.onFocusInput}
						className="label-in-left"
						onChange={(e) => this.onChange(e)}
						onBlur={
							() => {
								this.setState({ inputFocus: false });
								this.onClose(contractName);
							}
						}
						onKeyPress={(e) => this.onPushEnter(e, contractName)}
					>

						<input />
						<span
							className="edit-option icon-edit-checked"
							role="button"
							onClick={() => this.changeName(contractName)}
							onKeyPress={() => this.changeName(contractName)}
							tabIndex="0"

						/>
						<span
							className="edit-option icon-edit-close"
							role="button"
							onClick={(e) => this.onClose(e)}
							onKeyPress={(e) => this.onClose(e)}
							tabIndex="0"
						/>
					</Input>

					<span className="error-message">Error message</span>
				</div>

			</React.Fragment>
		);
	}

	render() {
		const { location, accountId } = this.props;

		const contractName = location.pathname.split('/')[2];

		const contractId = JSON.parse(localStorage.getItem('contracts'))[accountId][contractName].id;
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
	// newName: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	accountId: PropTypes.string.isRequired,
	updateContractName: PropTypes.func.isRequired,
	disableContract: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		accountId: state.global.getIn(['activeUser', 'id']),
		newName: state.form.getIn([FORM_VIEW_CONTRACT, 'newName']),
	}),
	(dispatch) => ({
		updateContractName: (name) => dispatch(updateContractName(name)),
		disableContract: (name) => dispatch(disableContract(name)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_VIEW_CONTRACT, field, value)),
		setValue: (form, field, value) => dispatch(setValue(form, field, value)),
	}),
)(ContractSettings));
