import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'semantic-ui-react';
import { CACHE_MAPS } from 'echojs-lib';

import PrivateKeysScenario from '../PrivateKeysScenario';
import TransactionScenario from '../TransactionScenario';
import ViewModeTable from './ViewModeTable';
import EditModeTable from './EditModeTable';

import { formPermissionKeys, clear, permissionTransaction, isChanged } from '../../actions/TableActions';
import { PERMISSION_TABLE } from '../../constants/TableConstants';
import { clearForm, setInFormValue, setValue } from '../../actions/FormActions';
import {
	FORM_PERMISSION_KEY,
	FORM_PERMISSION_ACTIVE_TABLE_TITLE,
	FORM_PERMISSION_ACTIVE_TABLE_DESCRIPTION,
	FORM_PERMISSION_ACTIVE_TABLE_TOOLTIP_TEXT,
	FORM_PERMISSION_ECHO_RAND_TABLE_TITLE,
	FORM_PERMISSION_ECHO_RAND_TABLE_DESCRIPTION,
	FORM_PERMISSION_ECHO_RAND_TABLE_LINK_TEXT,
	FORM_PERMISSION_ECHO_RAND_TABLE_LINK_URL,
	FORM_PERMISSION_ECHO_RAND_TABLE_ADVANCED_TEXT,
	FORM_PERMISSION_EDIT_MODE_ACTIVE_TABLE_DESCRIPTION,
	ADD_ACCOUNT_BUTTON_TEXT,
	ADD_ACCOUNT_BUTTON_TOOLTIP_TEXT,
	ADD_PUBLIC_KEY_BUTTON_TEXT,
	ADD_PUBLIC_KEY_BUTTON_TOOLTIP_TEXT,
	FORM_PERMISSION_MODE_EDIT,
	FORM_PERMISSION_MODE_VIEW,
} from '../../constants/FormConstants';

class Permissions extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			privateKeys: [],
		};
	}

	componentWillMount() {
		this.props.formPermissionKeys();
		this.setState({ privateKeys: [] });
	}

	componentDidUpdate(prevProps) {
		if (_.isEqual(prevProps, this.props)) {
			return;
		}

		const { accountName: prevAccountName } = prevProps;
		const { accountName } = this.props;
		const prevAccount = prevProps.account.toJS();
		const account = this.props.account.toJS();

		if (!prevAccount && account) {
			this.props.formPermissionKeys();
			return;
		}

		if (prevAccountName !== accountName) {
			this.props.formPermissionKeys();
			return;
		}

		if (!_.isEqual(prevAccount.active, account.active)) {
			this.props.formPermissionKeys();
		}

		if (!_.isEqual(prevAccount.echo_rand, account.echo_rand)) {
			this.props.formPermissionKeys();
		}
	}

	componentWillUnmount() {
		this.props.clear();
		this.props.clearForm();
		this.setState({ privateKeys: [] });
	}

	// onCancel(data) {
	// 	this.props.clearForm();

	// 	const roles = ['active'];

	// 	roles.forEach((role) => {
	// 		if (data[role].threshold) {
	// 			this.props.setValue([role, 'threshold'], data[role].threshold);
	// 		}

	// 		if (!data[role].keys) {
	// 			return;
	// 		}

	// 		data[role].keys.forEach((k) => {
	// 			this.props.setValue([role, 'keys', k.key, 'key'], k.key);
	// 			this.props.setValue([role, 'keys', k.key, 'weight'], k.weight);
	// 		});
	// 	});
	// }

	changeMode(mode, privateKeys) {
		this.setState({ privateKeys }, () => {
			if (mode === FORM_PERMISSION_MODE_EDIT) {
				this.props.set('isEditMode', true);
			} else if (mode === FORM_PERMISSION_MODE_VIEW) {
				this.props.set('isEditMode', false);
			}
		});
	}

	renderViewPanel() {
		return (
			<div className="sub-header-panel">
				<div className="view-panel-wrap">
					<PrivateKeysScenario
						onKeys={(privateKeys) => this.changeMode(FORM_PERMISSION_MODE_EDIT, privateKeys)}
					>
						{
							(getKeys) => (
								<React.Fragment>
									<Button
										className="grey-btn"
										size="medium"
										content="Edit mode"
										onClick={getKeys}
									/>
								</React.Fragment>
							)
						}
					</PrivateKeysScenario>
					<Button
						className="green-btn"
						size="medium"
						content="View & backup keys"
					/>
				</div>
			</div >
		);
	}

	renderEditPanel() {
		return (
			<div className="sub-header-panel">
				<div className="edit-panel-wrap">
					<Button
						className="grey-btn inverse"
						size="medium"
						content="Cancel"
						onClick={() => this.changeMode(FORM_PERMISSION_MODE_VIEW)}
					/>
					<TransactionScenario handleTransaction={() => this.props.permissionTransaction()}>
						{
							(submit) => (
								<React.Fragment>
									<Button
										className="grey-btn"
										size="medium"
										content="Save"
										onClick={submit}
									/>
								</React.Fragment>
							)
						}
					</TransactionScenario>

				</div>
			</div >
		);
	}

	renderViewTable() {
		const permissionsKeys = this.props.permissionsKeys.toJS();

		const {
			form,
			set,
			firstFetch,
		} = this.props;

		const active = {
			keys: permissionsKeys.active.keys.concat(permissionsKeys.active.accounts),
			threshold: permissionsKeys.active.threshold,
		};

		const echoRand = {
			keys: permissionsKeys.echoRand.keys,
		};

		return (
			<React.Fragment>
				<ViewModeTable
					keyRole="active"
					title={FORM_PERMISSION_ACTIVE_TABLE_TITLE}
					description={FORM_PERMISSION_ACTIVE_TABLE_DESCRIPTION}
					tooltipText={FORM_PERMISSION_ACTIVE_TABLE_TOOLTIP_TEXT}
					data={active}
					keys={form}
					set={set}
					setValue={this.props.setValue}
					isChanged={this.props.isChanged}
					firstFetch={firstFetch}
				/>
				<ViewModeTable
					keyRole="echoRand"
					title={FORM_PERMISSION_ECHO_RAND_TABLE_TITLE}
					description={FORM_PERMISSION_ECHO_RAND_TABLE_DESCRIPTION}
					headerLinkText={FORM_PERMISSION_ECHO_RAND_TABLE_LINK_TEXT}
					headerLinkUrl={FORM_PERMISSION_ECHO_RAND_TABLE_LINK_URL}
					advanced={FORM_PERMISSION_ECHO_RAND_TABLE_ADVANCED_TEXT}
					data={echoRand}
					keys={form}
					set={set}
					setValue={this.props.setValue}
					isChanged={this.props.isChanged}
					firstFetch={firstFetch}
				/>
			</React.Fragment>
		);
	}


	renderEditTable() {
		const permissionsKeys = this.props.permissionsKeys.toJS();

		const {
			form,
			set,
			firstFetch,
		} = this.props;

		const active = {
			keys: permissionsKeys.active.keys.concat(permissionsKeys.active.accounts),
			threshold: permissionsKeys.active.threshold,
		};

		const echoRand = {
			keys: permissionsKeys.echoRand.keys,
		};

		const privateKeys = this.state.privateKeys.reduce((acc, res) => {
			acc[res.publicKey] = {
				value: res.wif,
				error: '',
			};
			return acc;
		}, {});

		return (
			<React.Fragment>
				<EditModeTable
					keyRole="active"
					title={FORM_PERMISSION_ACTIVE_TABLE_TITLE}
					description={FORM_PERMISSION_EDIT_MODE_ACTIVE_TABLE_DESCRIPTION}
					addAccountButtonText={ADD_ACCOUNT_BUTTON_TEXT}
					addAccountButtonTooltipText={ADD_ACCOUNT_BUTTON_TOOLTIP_TEXT}
					addPublicKeyButtonText={ADD_PUBLIC_KEY_BUTTON_TEXT}
					addPublicKeyButtonTooltipText={ADD_PUBLIC_KEY_BUTTON_TOOLTIP_TEXT}
					data={active}
					keys={form}
					privateKeys={privateKeys}
					set={set}
					setValue={this.props.setValue}
					isChanged={this.props.isChanged}
					firstFetch={firstFetch}
					addAccount={() => {}}
					addPublicKey={() => {}}
				/>
				<EditModeTable
					keyRole="echoRand"
					title={FORM_PERMISSION_ECHO_RAND_TABLE_TITLE}
					description={FORM_PERMISSION_ECHO_RAND_TABLE_DESCRIPTION}
					headerLinkText={FORM_PERMISSION_ECHO_RAND_TABLE_LINK_TEXT}
					headerLinkUrl={FORM_PERMISSION_ECHO_RAND_TABLE_LINK_URL}
					advanced={FORM_PERMISSION_ECHO_RAND_TABLE_ADVANCED_TEXT}
					data={echoRand}
					keys={form}
					privateKeys={privateKeys}
					set={set}
					setValue={this.props.setValue}
					isChanged={this.props.isChanged}
					firstFetch={firstFetch}
				/>
			</React.Fragment>
		);
	}

	renderAccountInfo() {
		const { accountId } = this.props;

		return (
			<div className="account-info">
				<span className="account-info-type">Account ID:</span>
				<span className="account-info-value">{accountId}</span>
			</div>
		);
	}

	renderPanel() {
		const { form } = this.props;

		const isEditMode = form.get('isEditMode');

		return isEditMode ? this.renderEditPanel() : this.renderViewPanel();
	}

	renderTable() {
		const { form } = this.props;

		const isEditMode = form.get('isEditMode');

		return isEditMode ? this.renderEditTable() : this.renderViewTable();
	}

	render() {
		return (
			<div className="permissions-wrap">
				<div className="sub-header">
					{
						this.renderAccountInfo()
					}
					{
						this.renderPanel()
					}
				</div>
				{
					this.renderTable()
				}
			</div>
		);
	}

}

Permissions.propTypes = {
	accountName: PropTypes.string.isRequired,
	accountId: PropTypes.string.isRequired,
	isChanged: PropTypes.bool.isRequired,
	permissionsKeys: PropTypes.object.isRequired,
	account: PropTypes.object,
	formPermissionKeys: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
	permissionTransaction: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	form: PropTypes.object.isRequired,
	firstFetch: PropTypes.bool.isRequired,
	set: PropTypes.func.isRequired,
};

Permissions.defaultProps = {
	account: null,
};

export default connect(
	(state) => {
		const accountId = state.global.getIn(['activeUser', 'id']);
		return {
			form: state.form.get(FORM_PERMISSION_KEY),
			accountName: state.global.getIn(['activeUser', 'name']),
			accountId: state.global.getIn(['activeUser', 'id']),
			account: state.echojs.getIn([CACHE_MAPS.ACCOUNTS_BY_ID, accountId]),
			permissionsKeys: state.table.get(PERMISSION_TABLE),
			isChanged: state.form.getIn([FORM_PERMISSION_KEY, 'isChanged']),
			firstFetch: state.form.getIn([FORM_PERMISSION_KEY, 'firstFetch']),
		};
	},
	(dispatch) => ({
		formPermissionKeys: () => dispatch(formPermissionKeys()),
		clear: () => dispatch(clear(PERMISSION_TABLE)),
		permissionTransaction: () => dispatch(permissionTransaction()),
		clearForm: () => dispatch(clearForm(FORM_PERMISSION_KEY)),
		setValue: (fields, value) => dispatch(setInFormValue(FORM_PERMISSION_KEY, fields, value)),
		set: (field, value) => dispatch(setValue(FORM_PERMISSION_KEY, field, value)),
		isChanged: () => dispatch(isChanged()),
	}),
)(Permissions);
