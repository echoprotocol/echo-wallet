import modalReducer from './ModalReducer';
import globalReducer from './GlobalReducer';
import formReducer from './FormReducer';
import keyChainReducer from './KeyChainReducer';
import assetReducer from './AssetReducer';
import tableReducer from './TableReducer';

export default {
	modal: modalReducer.reducer,
	global: globalReducer.reducer,
	form: formReducer.reducer,
	keychain: keyChainReducer.reducer,
	asset: assetReducer.reducer,
	table: tableReducer.reducer,
};
