import { connect } from 'react-redux';
import { CACHE_MAPS } from 'echojs-lib';
import { List, Map } from 'immutable';

import { FORM_TRANSFER } from '../../constants/FormConstants';

import { disableToken, getAssetsBalances, setAsset } from '../../actions/BalanceActions';
import { openModal } from '../../actions/ModalActions';
import { clearForm, setFormError, setFormValue, setIn, setValue } from '../../actions/FormActions';
import {
	checkAccount,
	getTransferFee,
	resetTransaction,
	setAssetActiveAccount, setTransferFee,
	subjectToSendSwitch,
	transferSwitch,
	generateEthAddress,
} from '../../actions/TransactionActions';
import { amountInput, setDefaultAsset } from '../../actions/AmountActions';
import { setContractFees } from '../../actions/ContractActions';
import { updateAccountAddresses, getBtcAddress } from '../../actions/AccountActions';
import Wallet from '../../components/Wallet';
import { getEthAddress } from '../../actions/SidechainActions';
import GlobalReducer from '../../reducers/GlobalReducer';

export default connect(
	(state) => ({
		fees: state.fee.toArray() || [],
		tokens: state.balance.get('tokens'),
		assets: state.form.getIn([FORM_TRANSFER, 'balance']).assets,
		accountName: state.global.getIn(['activeUser', 'name']),
		accountId: state.global.getIn(['activeUser', 'id']),
		from: state.form.getIn([FORM_TRANSFER, 'from']),
		to: state.form.getIn([FORM_TRANSFER, 'to']),
		avatarName: state.form.getIn([FORM_TRANSFER, 'avatarName']),
		bytecode: state.form.getIn([FORM_TRANSFER, 'bytecode']),
		amount: state.form.getIn([FORM_TRANSFER, 'amount']),
		fee: state.form.getIn([FORM_TRANSFER, 'fee']),
		currency: state.form.getIn([FORM_TRANSFER, 'currency']),
		feeError: state.form.getIn([FORM_TRANSFER, 'feeError']),
		isAvailableBalance: state.form.getIn([FORM_TRANSFER, 'isAvailableBalance']),
		accountAddresses: state.echojs.getIn([CACHE_MAPS.ACCOUNT_ADDRESSES_BY_ACCOUNT_ID, state.global.getIn(['activeUser', 'id'])]) || new List([]),
		btcAddress: state.echojs.getIn([CACHE_MAPS.ACCOUNT_BTC_ADDRESS_BY_ACCOUNT_ID, state.global.getIn(['activeUser', 'id'])]) || new Map({}),
		ethAddress: state.echojs.getIn([CACHE_MAPS.ACCOUNT_ETH_ADDRESS_BY_ACCOUNT_ID, state.global.getIn(['activeUser', 'id'])]) || new Map({}),
		fullCurrentAccount: state.echojs.getIn([CACHE_MAPS.FULL_ACCOUNTS, state.global.getIn(['activeUser', 'id'])]) || new Map({}),
		subjectTransferType: state.form.getIn([FORM_TRANSFER, 'subjectTransferType']),
		activePaymentTypeTab: state.global.get('activePaymentTypeTab'),
		activeCoinTypeTab: state.global.get('activeCoinTypeTab'),
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
		removeToken: (name, id) => dispatch(disableToken(name, id)),
		setAsset: (asset, type) => dispatch(setAsset(asset, type)),
		clearForm: (from) => dispatch(clearForm(from)),
		transfer: () => dispatch(transferSwitch()),
		resetTransaction: () => dispatch(resetTransaction()),
		setIn: (field, param) => dispatch(setIn(FORM_TRANSFER, field, param)),
		checkAccount: (value, subject) => dispatch(checkAccount(value, subject)),
		subjectToSendSwitch: (value) => dispatch(subjectToSendSwitch(value)),
		setTransferFee: () => dispatch(setTransferFee()),
		setValue: (field, value) => dispatch(setValue(FORM_TRANSFER, field, value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_TRANSFER, field, value)),
		setFormError: (field, error) => dispatch(setFormError(FORM_TRANSFER, field, error)),
		setDefaultAsset: () => dispatch(setDefaultAsset(FORM_TRANSFER)),
		setAssetActiveAccount: () => dispatch(setAssetActiveAccount()),
		getTransferFee: (asset) => dispatch(getTransferFee(FORM_TRANSFER, asset)),
		setContractFees: () => dispatch(setContractFees(FORM_TRANSFER)),
		amountInput: (value, currency, name) =>
			dispatch(amountInput(FORM_TRANSFER, value, currency, name)),
		updateAccountAddresses: () => dispatch(updateAccountAddresses()),
		getBtcAddress: () => dispatch(getBtcAddress()),
		generateEthAddress: () => dispatch(generateEthAddress()),
		getEthAddress: () => dispatch(getEthAddress()),
		getAssetsBalances: () => dispatch(getAssetsBalances()),
		setGlobalValue: (field, value) => dispatch(GlobalReducer.actions.set({ field, value })),
	}),
)(Wallet);

