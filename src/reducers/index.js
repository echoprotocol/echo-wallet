import modalReducer from './ModalReducer';
import globalReducer from './GlobalReducer';
import formReducer from './FormReducer';
import keyChainReducer from './KeyChainReducer';
import tableReducer from './TableReducer';
import balanceReducer from './BalanceReducer';
import transactionReducer from './TransactionReducer';
import contractReducer from './ContractReducer';


export default {
	modal: modalReducer.reducer,
	global: globalReducer.reducer,
	form: formReducer.reducer,
	keychain: keyChainReducer.reducer,
	table: tableReducer.reducer,
	balance: balanceReducer.reducer,
	transaction: transactionReducer.reducer,
	contract: contractReducer.reducer,
};
