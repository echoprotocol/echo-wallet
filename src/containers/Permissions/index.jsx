/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Popup } from 'semantic-ui-react';
import { CACHE_MAPS } from 'echojs-lib';

import PrivateKeyScenario from '../PrivateKeyScenario';
import PermissionTable from './PermissionTable';
import EditModeThrashold from './EditModeThrashold';
import EditModeTableRow from './EditModeTableRow';


import { formPermissionKeys, clear, permissionTransaction } from '../../actions/TableActions';
import { PERMISSION_TABLE } from '../../constants/TableConstants';
import TransactionScenario from '../TransactionScenario';
import { clearForm, setInFormValue } from '../../actions/FormActions';
import { FORM_PERMISSION_KEY } from '../../constants/FormConstants';

class Permissions extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			resetAddKeys: false,
		};
	}

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
	}

	componentWillUnmount() {
		this.props.clear();
		this.props.clearForm();
	}

	onCancel(data) {
		this.props.clearForm();

		this.setState({ resetAddKeys: true }, () => { this.setState({ resetAddKeys: false }); });

		const roles = ['active'];

		roles.forEach((role) => {
			if (data[role].threshold) {
				this.props.setValue([role, 'threshold'], data[role].threshold);
			}

			if (!data[role].keys) {
				return;
			}

			data[role].keys.forEach((k) => {
				this.props.setValue([role, 'keys', k.key, 'key'], k.key);
				this.props.setValue([role, 'keys', k.key, 'weight'], k.weight);
			});
		});
	}

	renderViewPanel() {
		return (
			<div className="view-panel-wrap">
				<Button
					className="grey-btn"
					size="medium"
					content="Edit mode"
				/>
				<Button
					className="green-btn"
					size="medium"
					content="View & backup keys"
				/>
			</div>
		);
	}

	renderViewMode() {
		return (
			<div className="view-mode-wrap">
				<div className="info-text">
					Making a backup of your keys helps ensure you can always maintain access to your funds.
					Anyone having access to your keys will take full control of the funds,
					so we strongly recommend storing it offline in a secure place.
				</div>
				<div className="list-wrap">
					<div className="list-header">
						<h3 className="list-header-title">Public Keys and Accounts</h3>
						<div className="list-header-info">
							<Popup
								trigger={<span className="inner-tooltip-trigger icon-info" />}
								content="You can split authority to sign a transaction by setting threshold. Total weight of all the keys in the wallet must be equal or more than threshold to sign a transaction."
								className="inner-tooltip"
								position="bottom center"
								style={{ width: 420 }}
							/>
							<span className="threshold">threshold</span>
							<span className="threshold-value">1</span>
						</div>
					</div>
					<div className="list">
						<div className="list-item">
							<div className="list-item-content">
								<div className="list-item-value">8BTS5EXBBsHfr8c3yWVpkeVCezi7Ywm6pTJ7qV1BDPsrpJUaL2U5Q</div>
								<div className="list-item-weight">
									<span className="weight">Weight:</span>
									<span className="value">1</span>
								</div>
							</div>
							<div className="list-item-panel">
								<Button
									className="main-btn light"
									size="medium"
									content="View WIF"
								/>
							</div>
						</div>
						<div className="list-item">
							<div className="list-item-content">
								<div className="list-item-value">Ywm6pTJ7qV1BDPsrpJUaL2U5Q8BTS5EXBBsHfr8c3yWVpkeVCezi7</div>
								<div className="list-item-weight">
									<span className="weight">Weight:</span>
									<span className="value">0.5</span>
								</div>
							</div>
							<div className="list-item-panel">
								<Button
									className="blue-btn"
									size="medium"
									content="Add WIF"
								/>
							</div>
						</div>
						<div className="list-item">
							<div className="list-item-content">
								<div className="list-item-value">accountName_1</div>
								<div className="list-item-weight">
									<span className="weight">Weight:</span>
									<span className="value">1</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="list-wrap">
					<div className="list-header">
						<h3 className="list-header-title">EchoRand Key</h3>
						<span className="list-header-advanced">(advanced)</span>
					</div>
					<div className="list-description">
						EchoRand Key is used for participating in blocks generation and for signing
						sidechain transactions by committee members.
						<a className="list-header-link" href="">Know more in Echo Docs </a>
					</div>
					<div className="list">
						<div className="list-item">
							<div className="list-item-content">
								<div className="list-item-value">8BTS5EXBBsHfr8c3yWVpkeVCezi7Ywm6pTJ7qV1BDPsrpJUaL2U5Q</div>
							</div>
							<div className="list-item-panel">
								<Button
									className="main-btn light"
									size="medium"
									content="View WIF"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderEditPanel() {
		return (
			<div className="edit-panel-wrap">
				<Button
					className="grey-btn inverse"
					size="medium"
					content="Cancel"
				/>
				<Button
					className="grey-btn"
					size="medium"
					content="Save"
				/>
			</div>
		);
	}
	renderEditMode() {
		return (
			<div className="edit-mode-wrap">
				<div className="list-wrap">
					<div className="list-header">
						<h3 className="list-header-title">Public Keys and Accounts</h3>
					</div>
					<div className="list-header-row">
						<div className="list-header-col">
							<div className="list-description">
								The settings below allow you to specify the keys and / or accounts,
								whose signatures will be necessary to send a transaction from your account.
								Using threshold and weight you can separate access to an account
								between several keys and / or accounts.
							</div>
						</div>
						<div className="list-header-col">
							<EditModeThrashold />
						</div>
					</div>
					<div className="list">
						<EditModeTableRow type="keys" keyRole="active" />
						<EditModeTableRow type="keys" keyRole="active" />
						<EditModeTableRow type="account" keyRole="active" />
					</div>
					<div className="list-panel">
						<Button
							className="main-btn"
							size="medium"
						>
							<Popup
								trigger={<span className="main-btn-popup">Add Account</span>}
								content="Provide access to send transaction to another account"
								className="inner-tooltip"
								position="bottom center"
								style={{ width: 380 }}
							/>
						</Button>
						<Button
							className="main-btn"
							size="medium"
						>
							<Popup
								trigger={<span className="main-btn-popup">Add public key</span>}
								content="Add an additional key to sign transactions"
								className="inner-tooltip"
								position="bottom center"
								style={{ width: 300 }}
							/>
						</Button>
					</div>
				</div>
				<div className="list-wrap">
					<div className="list-header">
						<h3 className="list-header-title">EchoRand Key</h3>
						<span className="list-header-advanced">(for advanced users)</span>
					</div>
					<div className="list-description">
						EchoRand Key is used for participating in blocks generation and for signing
						sidechain transactions by committee members.
						<a className="list-header-link" href="">Know more in Echo Docs </a>
					</div>
					<div className="list">
						<EditModeTableRow type="keys" keyRole="echoRand" />
					</div>
				</div>
			</div>
		);
	}
	render() {
		// let { permissionsKeys } = this.props;

		// permissionsKeys = permissionsKeys.toJS();

		// const active = {
		// 	keys: permissionsKeys.active.keys.concat(permissionsKeys.active.accounts),
		// 	threshold: permissionsKeys.active.threshold,
		// };

		return (

			<div className="permissions-wrap">
				<div className="sub-header">

					<div className="account-info">
						<span className="account-info-type">Account ID:</span>
						<span className="account-info-value">1.16.0</span>
					</div>
					<div className="sub-header-panel" >
						{

							// this.renderViewPanel()
							this.renderEditPanel()
						}
					</div>
				</div>
				{
					// this.renderViewMode()
					this.renderEditMode()
				}
				{/* <TransactionScenario handleTransaction={() => this.props.permissionTransaction()}>
					{
						(submitTr) => (
							this.props.isChanged &&
								<div className="top-btn-container">
									<Button
										basic
										className="txt-btn"
										content="Cancel"
										onClick={() => this.onCancel({ active })}
									/>
									<Button
										basic
										className="green"
										content="Save"
										onClick={submitTr}
									/>
								</div>
						)
					}
				</TransactionScenario>
				<PrivateKeyScenario>
					{
						(keys, submit) => (
							<React.Fragment>
								<PermissionTable
									keyRole="active"
									table="Active"
									description="Active key allows you to sign transactions Use this key to log in into wallets."
									data={active}
									keys={keys}
									submit={submit}
									resetAddKeys={this.state.resetAddKeys}
								/>
							</React.Fragment>
						)
					}
				</PrivateKeyScenario> */}
			</div>
		);
	}

}

Permissions.propTypes = {
	accountName: PropTypes.string.isRequired,
	isChanged: PropTypes.bool.isRequired,
	permissionsKeys: PropTypes.object.isRequired,
	account: PropTypes.object,
	formPermissionKeys: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
	permissionTransaction: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
};

Permissions.defaultProps = {
	account: null,
};

export default connect(
	(state) => {
		const accountId = state.global.getIn(['activeUser', 'id']);
		return {
			accountName: state.global.getIn(['activeUser', 'name']),
			account: state.echojs.getIn([CACHE_MAPS.ACCOUNTS_BY_ID, accountId]),
			permissionsKeys: state.table.get(PERMISSION_TABLE),
			isChanged: state.form.getIn([FORM_PERMISSION_KEY, 'isChanged']),
		};
	},
	(dispatch) => ({
		formPermissionKeys: () => dispatch(formPermissionKeys()),
		clear: () => dispatch(clear(PERMISSION_TABLE)),
		permissionTransaction: () => dispatch(permissionTransaction()),
		clearForm: () => dispatch(clearForm(FORM_PERMISSION_KEY)),
		setValue: (fields, value) => dispatch(setInFormValue(FORM_PERMISSION_KEY, fields, value)),
	}),
)(Permissions);
