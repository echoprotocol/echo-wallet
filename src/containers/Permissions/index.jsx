/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'semantic-ui-react';
import { CACHE_MAPS, PrivateKey } from 'echojs-lib';

import PrivateKeyScenario from '../PrivateKeyScenario';
import PrivateKeysScenario from '../PrivateKeysScenario';
import BackupKeysScenario from '../BackupKeysScenario';
import ViewModeTable from './ViewModeTable';
import EditModeTable from './EditModeTable';
import Loading from '../../components/Loader/LoadingData';

import { isPublicKey } from '../../helpers/ValidateHelper';
import { formPermissionKeys, clear, permissionTransaction, isChanged, isOnlyWifChanged } from '../../actions/TableActions';
import { PERMISSION_TABLE } from '../../constants/TableConstants';
import { clearForm, setInFormValue, setValue, setInFormError, removeKey } from '../../actions/FormActions';
import { editWifs } from '../../actions/AuthActions';
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
import WarningConfirmThresholdScenario from '../WarningConfirmThresholdScenario';
import { checkKeyWeightWarning } from '../../actions/BalanceActions';
import GlobalReducer from '../../reducers/GlobalReducer';

class Permissions extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			basePrivateKeys: {
				active: {},
				echoRand: {},
			},
			privateKeys: {
				active: {},
				echoRand: {},
			},
		}
	}

	componentWillMount() {
		this.props.formPermissionKeys();
		this.setState({ privateKeys: { active: {}, echoRand: {} } });
	}

	async componentDidUpdate(prevProps) {
		if (_.isEqual(prevProps, this.props)) {
			if (!_.isEqual(this.state.basePrivateKeys, this.state.privateKeys)) {
				this.props.checkWIFChanged(this.state.privateKeys, this.state.basePrivateKeys);
			}
			return;
		}

		this.props.checkWIFChanged(this.state.privateKeys, this.state.basePrivateKeys);
		const { accountName: prevAccountName, form: prevForm, permissionsKeys: prevPermissionsKeys } = prevProps;
		const { accountName, form, permissionsKeys, networkName, accountId } = this.props;
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

		if (!_.isEqual(prevAccount.echo_rand, account.echo_rand)) {
			this.props.formPermissionKeys();
		}

		if (form.get('isEditMode') !== prevForm.get('isEditMode')) {
			this.props.formPermissionKeys();
		}

		if (permissionsKeys !== prevPermissionsKeys) {
			const keyWeight = await this.props.checkKeyWeightWarning(networkName, accountId);
			this.props.setWeightWarning(keyWeight);
		}
	}

	async saveWifs(password) {
		const { form } = this.props;
		const { privateKeys, basePrivateKeys } = this.state;
		const account = this.props.account.toJS();

		let activePrivateKeysEntries = Object.entries(privateKeys.active);
		let echoRandPrivateKeysEntries = Object.entries(privateKeys.echoRand);

		const activeBasePrivateKeysEntries = Object.entries(basePrivateKeys.active);
		const echoRandBasePrivateKeysEntries = Object.entries(basePrivateKeys.echoRand);

		const newActiveWifs = activePrivateKeysEntries
			.map(([index, wif]) => {
				const publicKey = form.getIn(['active', 'keys', index, 'key']);

				if (wif && wif.error) {
					return null;
				}

				if (publicKey && publicKey.value) {
					if (!wif || !wif.value) {
						if (activeBasePrivateKeysEntries.some(([indexA, wifA]) => indexA === publicKey.value && wifA && wifA.value)) {
							if (
								echoRandPrivateKeysEntries.some(([indexA, wifA]) => indexA === publicKey.value && wifA && wifA.value) &&
								echoRandBasePrivateKeysEntries.some(([indexA, wifA]) => indexA === publicKey.value && wifA && wifA.value)
							) {
								echoRandPrivateKeysEntries = echoRandPrivateKeysEntries.filter(([indexA]) => indexA !== publicKey.value);
							}
						} else {
							const echoRandPrivateKeyData = echoRandPrivateKeysEntries.find(([indexA, wifA]) => indexA === publicKey.value && wifA && wifA.value)
							if (echoRandPrivateKeyData) {
								const [, echoRandPrivateKeyWif] = echoRandPrivateKeyData;
								return { publicKey: publicKey.value, wif: echoRandPrivateKeyWif.value, type: 'active' };
							}
						}
					} else {
						if (activeBasePrivateKeysEntries.some(([indexA, wifA]) => indexA === publicKey.value && wifA && wifA.value)) {
							if (
								!echoRandPrivateKeysEntries.some(([indexA, wifA]) => indexA === publicKey.value && wifA && wifA.value) &&
								echoRandBasePrivateKeysEntries.some(([indexA, wifA]) => indexA === publicKey.value && wifA && wifA.value)
							) {
								return null;
							}
						} else {
							if (
								!echoRandPrivateKeysEntries.some(([indexA, wifA]) => indexA === publicKey.value && wifA && wifA.value) &&
								!echoRandBasePrivateKeysEntries.some(([indexA, wifA]) => indexA === publicKey.value && wifA && wifA.value)
							) {
								echoRandPrivateKeysEntries = echoRandPrivateKeysEntries.map((privateKeyEntryItem) => {
									const [indexA] = privateKeyEntryItem;

									if (indexA === publicKey.value) {
										return [indexA, { value: wif.value }];
									}

									return privateKeyEntryItem;
								});
							}
						}

						return { publicKey: publicKey.value, wif: wif.value, type: 'active' };
					}
				}

				return null;
			})
			.filter((activeKeyItem) => activeKeyItem);

		const newEchoRandWifs = echoRandPrivateKeysEntries
			.filter(([index, wif]) => {
				const publicKey = form.getIn(['echoRand', 'keys', index, 'key']);

				return publicKey && publicKey.value && wif && wif.value && !wif.error
			})
			.map(([index, wif]) => {
				const publicKey = form.getIn(['echoRand', 'keys', index, 'key']).value;
				return { publicKey, wif: wif.value, type: 'echoRand' };
			})

		const wifs = [...newActiveWifs, ...newEchoRandWifs];
		await this.props.editWifs(wifs, account, password);
		this.clear();
	}

	componentWillUnmount() {
		this.props.clear();
		this.props.clearForm();
		this.setState({ privateKeys: { active: {}, echoRand: {} } });
	}

	clear() {
		this.props.clear();
		this.props.clearForm();
		this.setState({ privateKeys: { active: {}, echoRand: {} } }, () => {
			this.props.formPermissionKeys();
		});
	}

	setWif(keyRole, type, e) {

		const { form } = this.props;
		const { privateKeys } = this.state;

		const field = e.target.name;
		const wif = e.target.value.trim();
		const newPrivateKeys = { ...privateKeys };
		if (!newPrivateKeys[keyRole][field]) {
			newPrivateKeys[keyRole][field] = {};
		}
		newPrivateKeys[keyRole][field].value = wif;
		newPrivateKeys[keyRole][field].error = '';
		newPrivateKeys[keyRole][field].type = keyRole;
		try {
			if (wif) {
				const publicKey = PrivateKey.fromWif(wif).toPublicKey().toString();
				const key = form.getIn([keyRole, type, field, 'key']);
				if (key && key.value) {
					if (isPublicKey(key.value)) {
						if (key.value !== publicKey) {
							newPrivateKeys[keyRole][field].error = 'Invalide private key for current public key';
						} else {
							this.props.setValue([keyRole, type, field, 'hasWif'], true);
						}
					}
				} else {
					this.props.setValue([keyRole, type, field, 'key'], publicKey);
					this.props.setValue([keyRole, type, field, 'hasWif'], true);
				}
			} else {
				this.props.setValue([keyRole, type, field, 'hasWif'], false);
			}
			this.setState({ privateKeys: newPrivateKeys });
		} catch (e) {
			newPrivateKeys[keyRole][field].error = 'Invalide private key';
			newPrivateKeys[keyRole][field].value = wif;
			this.props.setValue([keyRole, type, field, 'hasWif'], false);
			this.setState({ privateKeys: newPrivateKeys });
		}
	}

	validateWif(keyRole, type, field, key) {
		const { privateKeys } = this.state;

		const newPrivateKeys = { ...privateKeys };
		if (!newPrivateKeys[keyRole][field]) {
			newPrivateKeys[keyRole][field] = { value: '', type: keyRole, error: '' };
		}

		newPrivateKeys[keyRole][field].error = '';

		const wif = newPrivateKeys[keyRole][field].value;

		try {
			if (wif) {
				const publicKey = PrivateKey.fromWif(wif).toPublicKey().toString();
				if (key) {
					if (isPublicKey(key)) {
						if (key !== publicKey) {
							newPrivateKeys[keyRole][field].error = 'Invalide private key for current public key';
						} else {
							this.props.setValue([keyRole, type, field, 'hasWif'], true);
						}
					}
				}
			} else {
				this.props.setValue([keyRole, type, field, 'hasWif'], false);
			}
			this.setState({ privateKeys: newPrivateKeys });
		} catch (e) {
			newPrivateKeys[keyRole][field].error = 'Invalide private key';
			this.props.setValue([keyRole, type, field, 'hasWif'], false);
			this.setState({ privateKeys: newPrivateKeys });
		}
	}

	changeMode(mode, privateKeys) {
		const permissionsKeys = this.props.permissionsKeys.toJS();
		const newPrivateKeys = privateKeys || [];

		const activePrivetKeys = permissionsKeys.active.keys
			.reduce((acc, { key }) => {
				const privateKey = newPrivateKeys.find(({ publicKey, type }) => key === publicKey && type === 'active');
				acc[key] = privateKey && { value: privateKey.wif, error: '', type: privateKey.type };
				return acc;
			}, {})

		const echoRandPrivetKeys = permissionsKeys.echoRand.keys
			.reduce((acc, { key }) => {
				const privateKey = newPrivateKeys.find(({ publicKey, type }) => key === publicKey && type === 'echoRand');
				acc[key] = privateKey && { value: privateKey.wif, error: '', type: privateKey.type };
				return acc;
			}, {})

		const privateKeysByRole = {
			active: activePrivetKeys,
			echoRand: echoRandPrivetKeys,
		}

		this.setState(
			{ privateKeys: privateKeysByRole, basePrivateKeys: _.cloneDeep(privateKeysByRole) },
			() => {
				if (mode === FORM_PERMISSION_MODE_EDIT) {
					this.props.set('isEditMode', true);
				} else if (mode === FORM_PERMISSION_MODE_VIEW) {
					this.props.set('isEditMode', false);
					this.clear();
				}
			}
		);
	}

	renderViewPanel() {
		return (
			<div className="sub-header-panel">
				<div className="view-panel-wrap">
					<PrivateKeysScenario
						permissionsKeys={this.props.permissionsKeys}
						onKeys={(privateKeys) => this.changeMode(FORM_PERMISSION_MODE_EDIT, privateKeys)}
					>
						{
							(getKeys) => (
								<React.Fragment>
									<Button
										className="blue-btn"
										size="medium"
										content="Edit mode"
										onClick={getKeys}
									/>
								</React.Fragment>
							)
						}
					</PrivateKeysScenario>
					<BackupKeysScenario
						permissionsKeys={this.props.permissionsKeys}
					>
						{
							(backup) => (
								<Button
									className="green-btn"
									size="medium"
									content="View & backup keys"
									onClick={backup}
								/>
							)
						}
					</BackupKeysScenario>
				</div>
			</div >
		);
	}

	renderEditPanel() {
		const { isOnlyWIFChanged, keyWeightWarn } = this.props;
		return (
			<div className="sub-header-panel">
				<div className="edit-panel-wrap">
					<Button
						className="grey-btn inverse"
						size="medium"
						content="Cancel"
						onClick={() => this.changeMode(FORM_PERMISSION_MODE_VIEW)}
					/>
					<WarningConfirmThresholdScenario
						handleTransaction={
							() => this.props.permissionTransaction(this.state.privateKeys, this.state.basePrivateKeys)
						}
						onUnlock={(password) => this.saveWifs(password)}
					>
						{
							(submit) => (
								<Button
									className="blue-btn"
									size="medium"
									content="Save"
									onClick={submit}
									disabled={keyWeightWarn && !isOnlyWIFChanged}
								/>
							)
						}
					</WarningConfirmThresholdScenario>

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
			account,
		} = this.props;

		const active = {
			keys: permissionsKeys.active.keys.concat(permissionsKeys.active.accounts),
			threshold: permissionsKeys.active.threshold,
		};

		const echoRand = {
			keys: permissionsKeys.echoRand.keys,
		};

		return (
			<PrivateKeyScenario
				account={account}
			>
				{
					(showWif, addWif) => (
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
								addWif={addWif}
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
								addWif={addWif}
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
					description={FORM_PERMISSION_EDIT_MODE_ACTIVE_TABLE_DESCRIPTION}
					addAccountButtonText={ADD_ACCOUNT_BUTTON_TEXT}
					addAccountButtonTooltipText={ADD_ACCOUNT_BUTTON_TOOLTIP_TEXT}
					addPublicKeyButtonText={ADD_PUBLIC_KEY_BUTTON_TEXT}
					addPublicKeyButtonTooltipText={ADD_PUBLIC_KEY_BUTTON_TOOLTIP_TEXT}
					data={active}
					keys={form}
					privateKeys={this.state.privateKeys.active}
					set={set}
					setValue={this.props.setValue}
					isChanged={this.props.isChanged}
					firstFetch={firstFetch}
					setWif={(keyRole, type, e) => this.setWif(keyRole, type, e)}
					removeKey={(fields) => this.props.removeKey(fields)}
					validateWif={(keyRole, type, field, key) => this.validateWif(keyRole, type, field, key)}
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
					privateKeys={this.state.privateKeys.echoRand}
					set={set}
					setValue={this.props.setValue}
					isChanged={this.props.isChanged}
					firstFetch={firstFetch}
					setWif={(keyRole, type, e) => this.setWif(keyRole, type, e)}
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
		const { showLoader } = this.props;
		return (
			showLoader ?
				<Loading text="Apllying changes..." /> :
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
	networkName: PropTypes.string.isRequired,
	isChanged: PropTypes.func.isRequired,
	permissionsKeys: PropTypes.object.isRequired,
	account: PropTypes.object,
	formPermissionKeys: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
	permissionTransaction: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setError: PropTypes.func.isRequired,
	form: PropTypes.object.isRequired,
	firstFetch: PropTypes.bool.isRequired,
	showLoader: PropTypes.bool.isRequired,
	set: PropTypes.func.isRequired,
	removeKey: PropTypes.func.isRequired,
	editWifs: PropTypes.func.isRequired,
	checkKeyWeightWarning: PropTypes.func.isRequired,
	setWeightWarning: PropTypes.func.isRequired,
	isOnlyWIFChanged: PropTypes.bool.isRequired,
	keyWeightWarn: PropTypes.bool.isRequired,
	checkWIFChanged: PropTypes.func.isRequired,
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
			networkName: state.global.getIn(['network', 'name']),
			account: state.echojs.getIn([CACHE_MAPS.FULL_ACCOUNTS, accountId]),
			permissionsKeys: state.table.get(PERMISSION_TABLE),
			firstFetch: state.form.getIn([FORM_PERMISSION_KEY, 'firstFetch']),
			isChanged: state.form.getIn([FORM_PERMISSION_KEY, 'isChanged']),
			fullAccount: state.global.getIn(['activeUser']),
			showLoader: state.global.get('permissionLoading'),
			isOnlyWIFChanged: state.form.getIn([FORM_PERMISSION_KEY, 'isOnlyWIFChanged']),
			keyWeightWarn: state.global.get('keyWeightWarn'),
		};
	},
	(dispatch) => ({
		formPermissionKeys: () => dispatch(formPermissionKeys()),
		clear: () => dispatch(clear(PERMISSION_TABLE)),
		permissionTransaction: (privateKeys, basePrivateKeys) =>
			dispatch(permissionTransaction(privateKeys, basePrivateKeys)),
		clearForm: () => dispatch(clearForm(FORM_PERMISSION_KEY)),
		setValue: (fields, value) => dispatch(setInFormValue(FORM_PERMISSION_KEY, fields, value)),
		setError: (fields, value) => dispatch(setInFormError(FORM_PERMISSION_KEY, fields, value)),
		removeKey: (fields) => dispatch(removeKey(FORM_PERMISSION_KEY, fields)),
		set: (field, value) => dispatch(setValue(FORM_PERMISSION_KEY, field, value)),
		isChanged: () => dispatch(isChanged()),
		editWifs: (keys, account, password) => dispatch(editWifs(keys, account, password)),
		checkKeyWeightWarning: (networkName, accountId) =>
			dispatch(checkKeyWeightWarning(networkName, accountId)),
		setWeightWarning: (keyWeightWarn) => dispatch(GlobalReducer.actions.set({ field: 'keyWeightWarn', value: keyWeightWarn })),
		checkWIFChanged: (privateKeys, basePrivateKeys) => dispatch(isOnlyWifChanged(privateKeys, basePrivateKeys)),
	}),
)(Permissions);
