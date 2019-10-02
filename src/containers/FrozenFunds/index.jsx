import { connect } from 'react-redux';
import { List } from 'immutable';

import { FORM_FREEZE } from '../../constants/FormConstants';
import FrozenFunds from '../../components/FrozenFunds';

import { disableToken, setAsset } from '../../actions/BalanceActions';
import { openModal } from '../../actions/ModalActions';
import { clearForm, setFormError, setFormValue, setIn, setValue } from '../../actions/FormActions';
import {
	getFreezeBalanceFee,
	resetTransaction,
	setAssetActiveAccount,
	freezeBalance,
	setAssetsToForm,
} from '../../actions/TransactionActions';
import { amountInput, setDefaultAsset } from '../../actions/AmountActions';


export default connect(
	(state) => ({
		fees: state.fee.toArray() || [],
		tokens: List([]),
		assets: state.form.getIn([FORM_FREEZE, 'balance']).assets,
		amount: state.form.getIn([FORM_FREEZE, 'amount']),
		fee: state.form.getIn([FORM_FREEZE, 'fee']),
		currency: state.form.getIn([FORM_FREEZE, 'currency']),
		feeError: state.form.getIn([FORM_FREEZE, 'feeError']),
		duration: state.form.getIn([FORM_FREEZE, 'duration']),
		isAvailableBalance: state.form.getIn([FORM_FREEZE, 'isAvailableBalance']),
		activeUserId: state.global.getIn(['activeUser', 'id']),
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
		removeToken: (name, id) => dispatch(disableToken(name, id)),
		setAsset: (asset, type) => dispatch(setAsset(asset, type)),
		clearForm: () => dispatch(clearForm(FORM_FREEZE)),
		freezeBalance: () => dispatch(freezeBalance()),
		resetTransaction: () => dispatch(resetTransaction()),
		setIn: (field, param) => dispatch(setIn(FORM_FREEZE, field, param)),
		setValue: (field, value) => dispatch(setValue(FORM_FREEZE, field, value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_FREEZE, field, value)),
		setFormError: (field, error) => dispatch(setFormError(FORM_FREEZE, field, error)),
		setDefaultAsset: () => dispatch(setDefaultAsset(FORM_FREEZE)),
		setAssetActiveAccount: () => dispatch(setAssetActiveAccount()),
		getTransactionFee: (asset) => dispatch(getFreezeBalanceFee(FORM_FREEZE, asset)),
		setAssets: () => dispatch(setAssetsToForm(FORM_FREEZE)),
		amountInput: (value, currency, name) =>
			dispatch(amountInput(FORM_FREEZE, value, currency, name)),
	}),
)(FrozenFunds);
