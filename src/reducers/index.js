import modalReducer from './ModalReducer';
import globalReducer from './GlobalReducer';
import keyChainReducer from './KeyChainReducer';

export default {
	modal: modalReducer.reducer,
	global: globalReducer.reducer,
	keychain: keyChainReducer.reducer,
};
