import modalReducer from './ModalReducer';
import globalReducer from './GlobalReducer';
import formReducer from './FormReducer';
import keyChainReducer from './KeyChainReducer';

export default {
	modal: modalReducer.reducer,
	global: globalReducer.reducer,
	form: formReducer.reducer,
	keychain: keyChainReducer.reducer,
};
