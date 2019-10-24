import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Popup } from 'semantic-ui-react';
import { CACHE_MAPS } from 'echojs-lib';

import PrivateKeyScenario from '../PrivateKeyScenario';
import PrivateKeysScenario from '../PrivateKeysScenario';
import TransactionScenario from '../TransactionScenario';
import ViewModeTable from './ViewModeTable';
import EditModeTable from './EditModeTable';

// import EditModeThrashold from './EditModeThrashold';
// import EditModeTableRow from './EditModeTableRow';


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
	FORM_PERMISSION_MODE_EDIT,
	FORM_PERMISSION_MODE_VIEW,
} from '../../constants/FormConstants';

class Permissions extends React.Component {

	componentWillMount() {
		this.props.formPermissionKeys();
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

	changeMode(mode) {
		if (mode === FORM_PERMISSION_MODE_EDIT) {
			this.props.set('isEditMode', true);
		} else if (mode === FORM_PERMISSION_MODE_VIEW) {
			this.props.set('isEditMode', false);
		}
	}

	renderViewPanel() {
		return (
			<div className="sub-header-panel">
				<div className="view-panel-wrap">
					<PrivateKeysScenario>
						{
							(privateKeys, getKeys) => (
								<React.Fragment>
									<Button
										className="grey-btn"
										size="medium"
										content="Edit mode"
										onClick={() => getKeys(() =>
											this.changeMode(FORM_PERMISSION_MODE_EDIT, privateKeys))}
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
			<PrivateKeyScenario>
				{
					(showWif) => (
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
								showWif={showWif}
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
								showWif={showWif}
							/>
						</React.Fragment>
					)
				}
			</PrivateKeyScenario>
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

		return (
			<React.Fragment>
				<EditModeTable
					keyRole="active"
					title={FORM_PERMISSION_ACTIVE_TABLE_TITLE}
					description={FORM_PERMISSION_ACTIVE_TABLE_DESCRIPTION}
					data={active}
					keys={form}
					set={set}
					setValue={this.props.setValue}
					isChanged={this.props.isChanged}
					firstFetch={firstFetch}
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
					set={set}
					setValue={this.props.setValue}
					isChanged={this.props.isChanged}
					firstFetch={firstFetch}
				/>
			</React.Fragment>
		);
		// return (
		// 	<div className="edit-mode-wrap">
		// 		<div className="list-wrap">
		// 			<div className="list-header">
		// 				<h3 className="list-header-title">Public Keys and Accounts</h3>
		// 			</div>
		// 			<div className="list-header-row">
		// 				<div className="list-header-col">
		// 					<div className="list-description">
		// 						The settings below allow you to specify the keys and / or accounts,
		// 						whose signatures will be necessary to send a transaction from your account.
		// 						Using threshold and weight you can separate access to an account
		// 						between several keys and / or accounts.
		// 					</div>
		// 				</div>
		// 				<div className="list-header-col">
		// 					<EditModeThrashold />
		// 				</div>
		// 			</div>
		// 			<div className="list">
		// 				<EditModeTableRow type="keys" keyRole="active" />
		// 				<EditModeTableRow type="keys" keyRole="active" />
		// 				<EditModeTableRow type="account" keyRole="active" />
		// 			</div>
		// 			<div className="list-panel">
		// 				<Button
		// 					className="main-btn"
		// 					size="medium"
		// 				>
		// 					<Popup
		// 						trigger={<span className="main-btn-popup">Add Account</span>}
		// 						content="Provide access to send transaction to another account"
		// 						className="inner-tooltip"
		// 						position="bottom center"
		// 						style={{ width: 380 }}
		// 					/>
		// 				</Button>
		// 				<Button
		// 					className="main-btn"
		// 					size="medium"
		// 				>
		// 					<Popup
		// 						trigger={<span className="main-btn-popup">Add public key</span>}
		// 						content="Add an additional key to sign transactions"
		// 						className="inner-tooltip"
		// 						position="bottom center"
		// 						style={{ width: 300 }}
		// 					/>
		// 				</Button>
		// 			</div>
		// 		</div>
		// 		<div className="list-wrap">
		// 			<div className="list-header">
		// 				<h3 className="list-header-title">EchoRand Key</h3>
		// 				<span className="list-header-advanced">(for advanced users)</span>
		// 			</div>
		// 			<div className="list-description">
		// 				EchoRand Key is used for participating in blocks generation and for signing
		// 				sidechain transactions by committee members.
		// 				<a className="list-header-link" href="">Know more in Echo Docs </a>
		// 			</div>
		// 			<div className="list">
		// 				<EditModeTableRow type="keys" keyRole="echoRand" />
		// 			</div>
		// 		</div>
		// 	</div>
		// );
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
