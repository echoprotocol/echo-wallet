import { connect } from 'react-redux';

import { FORM_TRANSFER } from '../../constants/FormConstants';

import { disableToken, setAsset } from '../../actions/BalanceActions';
import { openModal } from '../../actions/ModalActions';
import { clearForm, setFormError, setFormValue, setIn, setValue } from '../../actions/FormActions';
import {
	checkAccount,
	getTransferFee,
	resetTransaction,
	setAssetActiveAccount,
	transfer,
	generateEthAddress,
} from '../../actions/TransactionActions';
import { amountInput, setDefaultAsset } from '../../actions/AmountActions';

import Wallet from '../../components/Wallet';
import { setContractFees } from '../../actions/ContractActions';
import { getEthAddress } from '../../actions/SidechainActions';

export default connect(
	(state) => ({
		fees: state.fee.toArray() || [],
		tokens: state.balance.get('tokens'),
		assets: state.form.getIn([FORM_TRANSFER, 'balance']).assets,
		accountName: state.global.getIn(['activeUser', 'name']),
		from: state.form.getIn([FORM_TRANSFER, 'from']),
		to: state.form.getIn([FORM_TRANSFER, 'to']),
		amount: state.form.getIn([FORM_TRANSFER, 'amount']),
		fee: state.form.getIn([FORM_TRANSFER, 'fee']),
		currency: state.form.getIn([FORM_TRANSFER, 'currency']),
		feeError: state.form.getIn([FORM_TRANSFER, 'feeError']),
		isAvailableBalance: state.form.getIn([FORM_TRANSFER, 'isAvailableBalance']),
		ethAddress: state.sidechain.get('ethAddress'),
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
		removeToken: (name, id) => dispatch(disableToken(name, id)),
		setAsset: (asset, type) => dispatch(setAsset(asset, type)),
		clearForm: () => dispatch(clearForm(FORM_TRANSFER)),
		transfer: () => dispatch(transfer()),
		resetTransaction: () => dispatch(resetTransaction()),
		setIn: (field, param) => dispatch(setIn(FORM_TRANSFER, field, param)),
		checkAccount: (value, subject) => dispatch(checkAccount(value, subject)),
		setValue: (field, value) => dispatch(setValue(FORM_TRANSFER, field, value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_TRANSFER, field, value)),
		setFormError: (field, error) => dispatch(setFormError(FORM_TRANSFER, field, error)),
		setDefaultAsset: () => dispatch(setDefaultAsset(FORM_TRANSFER)),
		setAssetActiveAccount: () => dispatch(setAssetActiveAccount()),
		getTransferFee: (asset) => dispatch(getTransferFee(FORM_TRANSFER, asset)),
		setContractFees: () => dispatch(setContractFees(FORM_TRANSFER)),
		amountInput: (value, currency, name) =>
			dispatch(amountInput(FORM_TRANSFER, value, currency, name)),
		generateEthAddress: () => dispatch(generateEthAddress()),
		getEthAddress: () => dispatch(getEthAddress()),
	}),
)(Wallet);

