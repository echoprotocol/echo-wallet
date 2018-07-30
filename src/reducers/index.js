import modalReducer from './ModalReducer';
import globalReducer from './GlobalReducer';
import formReducer from './FormReducer';
import keyChainReducer from './KeyChainReducer';
import tableReducer from './TableReducer';
import balanceReducer from './BalanceReducer';
import buildTransactionReducer from './BuildTransactionReducer';

export default {
	modal: modalReducer.reducer,
	global: globalReducer.reducer,
	form: formReducer.reducer,
	keychain: keyChainReducer.reducer,
	table: tableReducer.reducer,
	balance: balanceReducer.reducer,
	buildtransaction: buildTransactionReducer.reducer,
};
