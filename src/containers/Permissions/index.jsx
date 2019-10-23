import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Popup } from 'semantic-ui-react';
import { CACHE_MAPS } from 'echojs-lib';

import PrivateKeyScenario from '../PrivateKeyScenario';
import PermissionTable from './PermissionTable';

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
							<span className="threshold"> threshold </span>
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
									basic
									className="txt-btn"
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
									basic
									className="txt-btn"
									content="View WIF"
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
									basic
									className="txt-btn"
									content="VIEW WIF"
								/>
							</div>
						</div>
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
					<div className="sub-header-panel">
						<Button
							className="grey"
							content="Edit mode"
						/>
						<Button
							className="green"
							content="View & backup keys"
						/>
					</div>
				</div>
				{
					this.renderViewMode()
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
