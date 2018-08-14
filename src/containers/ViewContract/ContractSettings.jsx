import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { updateContractName, disableContract } from '../../actions/ContractActions';
import { setFormValue, setValue } from '../../actions/FormActions';

import { FORM_VIEW_CONTRACT } from '../../constants/FormConstants';

class ContractSettings extends React.Component {


	constructor() {
		super();
		this.state = { isEditName: false };
	}

	onChange(e) {
		const field = e.target.name;
		const { value } = e.target;

		if (field) {
			this.props.setFormValue(field, value);
		}
	}

	onToggle() {
		this.setState({ isEditName: !this.state.isEditName });
	}

	changeName(oldName) {
		this.props.updateContractName(oldName);

		this.setState({ isEditName: !this.state.isEditName });

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

	renderContractInfo() {
		const { location, accountId } = this.props;

		const contractName = location.pathname.split('/')[2];

		const contractId = JSON.parse(localStorage.getItem('contracts'))[accountId][contractName].id;
		return (
			<ul className="control-panel">
				<li className="name">
					<span className="label">Name:</span>
					<span className="value pointer" role="button" onClick={() => this.onToggle()} onKeyPress={() => this.onToggle()} tabIndex="0">
						{contractName}
						<Icon name="edit" size="small" />
					</span>
				</li>
				<li className="id">
					<span className="label">Contract ID:</span>
					<span className="value">
						{contractId}
					</span>
				</li>
				<li className="act">
					<Button
						icon="trash"
						className="transparent"
						content="remove from watchlist"
						onClick={() => this.removeContract(contractName)}
					/>
				</li>
			</ul>
		);
	}

	renderChangeName() {
		const { newName, location } = this.props;

		const contractName = location.pathname.split('/')[2];

		return (
			<ul className="control-panel">
				<li className="name edit">
					<div className="ui input label-in-left">
						<input type="text" name="newName" value={newName.value} onChange={(e) => this.onChange(e)} />
						<span className="label">Name: </span>
						<div className="edit-options">
							<span className="icon-edit-checked" role="button" onClick={() => this.changeName(contractName)} onKeyPress={() => this.changeName(contractName)} tabIndex="0" />
							<span className="icon-edit-close" role="button" onClick={() => this.onToggle()} onKeyPress={() => this.onToggle()} tabIndex="0" />
						</div>
					</div>
				</li>
			</ul>
		);
	}

	render() {
		return (
			<div className="tab-full">
				<div className="control-wrap">
					{!this.state.isEditName ? this.renderContractInfo() : this.renderChangeName()}
				</div>
			</div>
		);
	}

}

ContractSettings.propTypes = {
	newName: PropTypes.object.isRequired,
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
