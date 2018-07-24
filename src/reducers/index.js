import modalReducer from './ModalReducer';
import globalReducer from './GlobalReducer';
import formReducer from './FormReducer';
import keyChainReducer from './KeyChainReducer';
import accountRducer from './AccountReducer';
import tableReducer from './TableReducer';

export default {
	modal: modalReducer.reducer,
	global: globalReducer.reducer,
	form: formReducer.reducer,
	keychain: keyChainReducer.reducer,
	account: accountRducer.reducer,
	table: tableReducer.reducer,
};
