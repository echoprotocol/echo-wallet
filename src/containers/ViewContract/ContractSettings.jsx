import React from 'react';
import { Button, Input } from 'semantic-ui-react';
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
		this.setState(...this.state, { isEditName: true });
	}

	onClose(e) {
		e.preventDefault();
		this.setState(...this.state, { isEditName: false });
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

			<Button
				className="value"
				onFocus={() => this.onOpen()}
				content={contractName}
				icon="edit"
			/>

		);
	}

	renderChangeName() {
		const { location } = this.props;

		const contractName = location.pathname.split('/')[2];

		return (

			<div
				className={classnames('error-wrap', { error: false })}
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

				<span className="error-message">Error message</span>
			</div>
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
