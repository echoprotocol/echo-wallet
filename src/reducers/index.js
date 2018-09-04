import modalReducer from './ModalReducer';
import globalReducer from './GlobalReducer';
import formReducer from './FormReducer';
import keyChainReducer from './KeyChainReducer';
import tableReducer from './TableReducer';
import balanceReducer from './BalanceReducer';
import transactionReducer from './TransactionReducer';
import contractReducer from './ContractReducer';
import converterReducer from './ConverterReducer';
import sortReducer from './SortReducer';
import contractFeeReducer from './ContractFeeReducer';
import permissionReducer from './PermissionReducer';


export default {
	modal: modalReducer.reducer,
	global: globalReducer.reducer,
	form: formReducer.reducer,
	keychain: keyChainReducer.reducer,
	table: tableReducer.reducer,
	balance: balanceReducer.reducer,
	transaction: transactionReducer.reducer,
	contract: contractReducer.reducer,
	converter: converterReducer.reducer,
	sort: sortReducer.reducer,
	fee: contractFeeReducer.reducer,
	permission: permissionReducer.reducer,
};
